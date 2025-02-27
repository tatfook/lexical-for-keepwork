/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {CodeNode} from '@lexical/code';
import type {
  ElementTransformer,
  TextFormatTransformer,
  TextMatchTransformer,
  Transformer,
} from '@lexical/markdown';
import type {LexicalNode, TextNode} from 'lexical';

import {$createCodeNode} from '@lexical/code';
import {$isListItemNode, $isListNode, ListItemNode} from '@lexical/list';
import {$isQuoteNode} from '@lexical/rich-text';
import {$findMatchingParent} from '@lexical/utils';
import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection, $isElementNode,
  $isParagraphNode, $isRootNode,
  $isTextNode,
  ElementNode, ParagraphNode,
} from 'lexical';
import {IS_APPLE_WEBKIT, IS_IOS, IS_SAFARI} from 'shared/environment';

import {PUNCTUATION_OR_SPACE, transformersByType} from './utils';

const MARKDOWN_EMPTY_LINE_REG_EXP = /^\s{0,3}$/;
const CODE_BLOCK_REG_EXP = /^[ \t]*```(\w{1,10})?\s?$/;
type TextFormatTransformersIndex = Readonly<{
  fullMatchRegExpByTag: Readonly<Record<string, RegExp>>;
  openTagsRegExp: RegExp;
  transformersByTag: Readonly<Record<string, TextFormatTransformer>>;
}>;

export function parseMarkdownString(
  parentNode: ElementNode,
  lines: string[],
  byType: Readonly<{
    element: Array<ElementTransformer>;
    textFormat: Array<TextFormatTransformer>;
    textMatch: Array<TextMatchTransformer>;
  }>): void {
  const linesLength = lines.length;
  const textFormatTransformersIndex = createTextFormatTransformersIndex(
    byType.textFormat,
  );
  for (let i = 0; i < linesLength;) {
    const lineText = lines[i];
    // handle multi line parser like Codeblocks
    let isMatched = false;
    for (const elementTransformer of byType.element) {
      const match = lineText.match(elementTransformer.regExp)
      if (elementTransformer.getNumberOfLines) {
        const numberOfLines = elementTransformer.getNumberOfLines(lines, i)
        if (i + numberOfLines > lines.length) {
          continue
        }
        if (match) {
          if (elementTransformer.recursivelyParse) {
            const elementNode = $createParagraphNode()
            parentNode.append(elementNode)
            parseMarkdownString(elementNode, lines.slice(i + 1, i + numberOfLines), byType)
          } else {
            const textNode = $createTextNode(
              lines.slice(i + 1, i + numberOfLines).join('\n'),
            )
            const elementNode = $createParagraphNode()
            elementNode.append(textNode)
            parentNode.append(elementNode)
          }
          elementTransformer.replace(
            parentNode.getLastChild() as ElementNode,
            (parentNode.getLastChild() as ElementNode).getChildren(),
            match,
            true
          )
          i += numberOfLines
          /**
           * only add one line if next line is the close mark
           * just like
           * ``` of code block
           * ::: of tip block
           *
           * delete the line `lines[i].match(elementTransformer.regExp`
           * ```
           * code
           * ```
           * ```
           * code
           * ```
           * when next line is ``` the code block will be parsed
           */
          if (i < linesLength &&
            (elementTransformer.closeRegExp && lines[i].match(elementTransformer.closeRegExp)
            )) {
            i++
          }
          isMatched = true
          break
        }
      }
    }
    if (isMatched) {
      continue
    }
    $importBlocks(
      lineText,
      parentNode,
      byType.element,
      textFormatTransformersIndex,
      byType.textMatch,
    )
    i++
  }
}

function clearEmptyParagraph(node: ElementNode) {
  const children = node.getChildren();
  for (const child of children) {
    if (isEmptyParagraph(child)) {
      child.remove();
    } else if ($isElementNode(child)) {
      clearEmptyParagraph(child);
    }
  }
}

export function createMarkdownImport(
  transformers: Array<Transformer>,
): (markdownString: string, node?: ElementNode) => void {
  const byType = transformersByType(transformers);


  return (markdownString, node) => {
    const lines = markdownString.split('\n');
    const root = node || $getRoot();
    root.clear();

    parseMarkdownString(root, lines, byType)


    // Removing empty paragraphs as md does not really
    // allow empty lines and uses them as dilimiter
    clearEmptyParagraph(root);

    if ($getSelection() !== null) {
      root.selectEnd();
    }
  };
}

function isEmptyParagraph(node: LexicalNode): boolean {
  if (!$isParagraphNode(node)) {
    return false;
  }

  const firstChild = node.getFirstChild();
  return (
    firstChild == null ||
    (node.getChildrenSize() === 1 &&
      $isTextNode(firstChild) &&
      MARKDOWN_EMPTY_LINE_REG_EXP.test(firstChild.getTextContent()))
  );
}

function $importBlocks(
  lineText: string,
  parentNode: ElementNode,
  elementTransformers: Array<ElementTransformer>,
  textFormatTransformersIndex: TextFormatTransformersIndex,
  textMatchTransformers: Array<TextMatchTransformer>,
) {
  // it has to be trimEnd, otherwise it will remove the space at the beginning of the line
  // for example ```html
  // <style>
  //   .markdown-body {
  // 	 }
  // </style>
  // ```
  const lineTextTrimmed = lineText.trimEnd();
  const textNode = $createTextNode(lineTextTrimmed);
  const elementNode = $createParagraphNode();
  elementNode.append(textNode);
  parentNode.append(elementNode)

  for (const {regExp, replace} of elementTransformers) {
    const match = lineText.match(regExp);

    if (match) {
      const textContent = lineText.slice(match[0].length)
      textNode.setTextContent(textContent);
      replace(elementNode, [textNode], match, true);
      break;
    }
  }

  importTextFormatTransformers(
    textNode,
    textFormatTransformersIndex,
    textMatchTransformers,
  );

  // If no transformer found and we left with original paragraph node
  // can check if its content can be appended to the previous node
  // if it's a paragraph, quote or list
  if (elementNode.isAttached() && lineTextTrimmed.length > 0) {
    const previousNode = elementNode.getPreviousSibling();
    if (
      $isParagraphNode(previousNode) ||
      $isQuoteNode(previousNode) ||
      $isListNode(previousNode)
    ) {
      let targetNode: typeof previousNode | ListItemNode | null = previousNode;

      if ($isListNode(previousNode)) {
        const lastDescendant = previousNode.getLastDescendant();
        if (lastDescendant == null) {
          targetNode = null;
        } else {
          targetNode = $findMatchingParent(lastDescendant, $isListItemNode);
        }
      }

      if (targetNode != null && targetNode.getTextContentSize() > 0) {
        targetNode.splice(targetNode.getChildrenSize(), 0, [
          $createLineBreakNode(),
          ...elementNode.getChildren(),
        ]);
        elementNode.remove();
      }
    }
  }
}

function $importCodeBlock(
  lines: Array<string>,
  startLineIndex: number,
  rootNode: ElementNode,
): [CodeNode | null, number] {
  const openMatch = lines[startLineIndex].match(CODE_BLOCK_REG_EXP);

  if (openMatch) {
    let endLineIndex = startLineIndex;
    const linesLength = lines.length;

    while (++endLineIndex < linesLength) {
      const closeMatch = lines[endLineIndex].match(CODE_BLOCK_REG_EXP);

      if (closeMatch) {
        const codeBlockNode = $createCodeNode(openMatch[1]);
        const textNode = $createTextNode(
          lines.slice(startLineIndex + 1, endLineIndex).join('\n'),
        );
        codeBlockNode.append(textNode);
        rootNode.append(codeBlockNode);
        return [codeBlockNode, endLineIndex];
      }
    }
  }

  return [null, startLineIndex];
}

// Processing text content and replaces text format tags.
// It takes outermost tag match and its content, creates text node with
// format based on tag and then recursively executed over node's content
//
// E.g. for "*Hello **world**!*" string it will create text node with
// "Hello **world**!" content and italic format and run recursively over
// its content to transform "**world**" part
function importTextFormatTransformers(
  textNode: TextNode,
  textFormatTransformersIndex: TextFormatTransformersIndex,
  textMatchTransformers: Array<TextMatchTransformer>,
) {
  const textContent = textNode.getTextContent();
  const match = findOutermostMatch(textContent, textFormatTransformersIndex);

  if (!match) {
    // Once text format processing is done run text match transformers, as it
    // only can span within single text node (unline formats that can cover multiple nodes)
    importTextMatchTransformers(textNode, textMatchTransformers);
    return;
  }

  let currentNode, remainderNode, leadingNode;

  // If matching full content there's no need to run splitText and can reuse existing textNode
  // to update its content and apply format. E.g. for **_Hello_** string after applying bold
  // format (**) it will reuse the same text node to apply italic (_)
  if (match[0] === textContent) {
    currentNode = textNode;
  } else {
    const startIndex = match.index || 0;
    const endIndex = startIndex + match[0].length;

    if (startIndex === 0) {
      [currentNode, remainderNode] = textNode.splitText(endIndex);
    } else {
      [leadingNode, currentNode, remainderNode] = textNode.splitText(
        startIndex,
        endIndex,
      );
    }
  }

  currentNode.setTextContent(match[2]);
  const transformer = textFormatTransformersIndex.transformersByTag[match[1]];

  if (transformer) {
    for (const format of transformer.format) {
      if (!currentNode.hasFormat(format)) {
        currentNode.toggleFormat(format);
      }
    }
  }

  // Recursively run over inner text if it's not inline code
  if (!currentNode.hasFormat('code')) {
    importTextFormatTransformers(
      currentNode,
      textFormatTransformersIndex,
      textMatchTransformers,
    );
  }

  // Run over leading/remaining text if any
  if (leadingNode) {
    importTextFormatTransformers(
      leadingNode,
      textFormatTransformersIndex,
      textMatchTransformers,
    );
  }

  if (remainderNode) {
    importTextFormatTransformers(
      remainderNode,
      textFormatTransformersIndex,
      textMatchTransformers,
    );
  }
}

function importTextMatchTransformers(
  textNode_: TextNode,
  textMatchTransformers: Array<TextMatchTransformer>,
) {
  let textNode = textNode_;

  mainLoop: while (textNode) {
    for (const transformer of textMatchTransformers) {
      const match = textNode.getTextContent().match(transformer.importRegExp);

      if (!match) {
        continue;
      }

      const startIndex = match.index || 0;
      const endIndex = startIndex + match[0].length;
      let replaceNode, newTextNode;

      if (startIndex === 0) {
        [replaceNode, textNode] = textNode.splitText(endIndex);
      } else {
        [, replaceNode, newTextNode] = textNode.splitText(startIndex, endIndex);
      }

      if (newTextNode) {
        importTextMatchTransformers(newTextNode, textMatchTransformers);
      }
      transformer.replace(replaceNode, match);
      continue mainLoop;
    }

    break;
  }
}

// Finds first "<tag>content<tag>" match that is not nested into another tag
function findOutermostMatch(
  textContent: string,
  textTransformersIndex: TextFormatTransformersIndex,
): RegExpMatchArray | null {
  const openTagsMatch = textContent.match(textTransformersIndex.openTagsRegExp);

  if (openTagsMatch == null) {
    return null;
  }

  for (const match of openTagsMatch) {
    // Open tags reg exp might capture leading space so removing it
    // before using match to find transformer
    const tag = match.replace(/^\s/, '');
    const fullMatchRegExp = textTransformersIndex.fullMatchRegExpByTag[tag];
    if (fullMatchRegExp == null) {
      continue;
    }

    const fullMatch = textContent.match(fullMatchRegExp);
    const transformer = textTransformersIndex.transformersByTag[tag];
    if (fullMatch != null && transformer != null) {
      if (transformer.intraword !== false) {
        return fullMatch;
      }

      // For non-intraword transformers checking if it's within a word
      // or surrounded with space/punctuation/newline
      const {index = 0} = fullMatch;
      const beforeChar = textContent[index - 1];
      const afterChar = textContent[index + fullMatch[0].length];

      if (
        (!beforeChar || PUNCTUATION_OR_SPACE.test(beforeChar)) &&
        (!afterChar || PUNCTUATION_OR_SPACE.test(afterChar))
      ) {
        return fullMatch;
      }
    }
  }

  return null;
}

function createTextFormatTransformersIndex(
  textTransformers: Array<TextFormatTransformer>,
): TextFormatTransformersIndex {
  const transformersByTag: Record<string, TextFormatTransformer> = {};
  const fullMatchRegExpByTag: Record<string, RegExp> = {};
  const openTagsRegExp = [];
  const escapeRegExp = `(?<![\\\\])`;

  for (const transformer of textTransformers) {
    const {tag} = transformer;
    transformersByTag[tag] = transformer;
    const tagRegExp = tag.replace(/(\*|\^|\+)/g, '\\$1');
    openTagsRegExp.push(tagRegExp);

    if (IS_SAFARI || IS_IOS || IS_APPLE_WEBKIT) {
      fullMatchRegExpByTag[tag] = new RegExp(
        `(${tagRegExp})(?![${tagRegExp}\\s])(.*?[^${tagRegExp}\\s])${tagRegExp}(?!${tagRegExp})`,
      );
    } else {
      fullMatchRegExpByTag[tag] = new RegExp(
        `(?<![\\\\${tagRegExp}])(${tagRegExp})((\\\\${tagRegExp})?.*?[^${tagRegExp}\\s](\\\\${tagRegExp})?)((?<!\\\\)|(?<=\\\\\\\\))(${tagRegExp})(?![\\\\${tagRegExp}])`,
      );
    }
  }

  return {
    // Reg exp to find open tag + content + close tag
    fullMatchRegExpByTag,
    // Reg exp to find opening tags
    openTagsRegExp: new RegExp(
      (IS_SAFARI || IS_IOS || IS_APPLE_WEBKIT ? '' : `${escapeRegExp}`) +
      '(' +
      openTagsRegExp.join('|') +
      ')',
      'g',
    ),
    transformersByTag,
  };
}
