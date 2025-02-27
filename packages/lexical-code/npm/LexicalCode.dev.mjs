/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'prismjs';
import 'prismjs/components/prism-clike.js';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-css.js';
import 'prismjs/components/prism-objectivec.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-powershell.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-rust.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-cpp.js';
import { isHTMLElement, addClassNamesToElement, removeClassNamesFromElement, mergeRegister } from '@lexical/utils';
import { ElementNode, $createParagraphNode, $isTextNode, $isTabNode, $createTabNode, $createLineBreakNode, $applyNodeReplacement, TextNode, $isLineBreakNode, $createTextNode, $getNodeByKey, $getSelection, $isRangeSelection, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND, INSERT_TAB_COMMAND, KEY_ARROW_UP_COMMAND, MOVE_TO_START, KEY_TAB_COMMAND, COMMAND_PRIORITY_LOW, $insertNodes, KEY_ARROW_DOWN_COMMAND, MOVE_TO_END } from 'lexical';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// invariant(condition, message) will refine types based on "condition", and
// if "condition" is false will throw an error. This function is special-cased
// in flow itself, so we can't name it anything else.
function invariant(cond, message, ...args) {
  if (cond) {
    return;
  }
  throw new Error('Internal Lexical error: invariant() is meant to be replaced at compile ' + 'time. There is no runtime version. Error: ' + message);
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mapToPrismLanguage = language => {
  // eslint-disable-next-line no-prototype-builtins
  return language != null && window.Prism.languages.hasOwnProperty(language) ? language : undefined;
};
function hasChildDOMNodeTag(node, tagName) {
  for (const child of node.childNodes) {
    if (isHTMLElement(child) && child.tagName === tagName) {
      return true;
    }
    hasChildDOMNodeTag(child, tagName);
  }
  return false;
}
const LANGUAGE_DATA_ATTRIBUTE = 'data-highlight-language';

/** @noInheritDoc */
class CodeNode extends ElementNode {
  /** @internal */

  static getType() {
    return 'code';
  }
  static clone(node) {
    return new CodeNode(node.__language, node.__key);
  }
  constructor(language, key) {
    super(key);
    this.__language = mapToPrismLanguage(language);
  }

  // View
  createDOM(config) {
    const element = document.createElement('code');
    addClassNamesToElement(element, config.theme.code);
    element.setAttribute('spellcheck', 'false');
    const language = this.getLanguage();
    if (language) {
      element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language);
    }
    return element;
  }
  updateDOM(prevNode, dom, config) {
    const language = this.__language;
    const prevLanguage = prevNode.__language;
    if (language) {
      if (language !== prevLanguage) {
        dom.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language);
      }
    } else if (prevLanguage) {
      dom.removeAttribute(LANGUAGE_DATA_ATTRIBUTE);
    }
    return false;
  }
  exportDOM(editor) {
    const element = document.createElement('pre');
    addClassNamesToElement(element, editor._config.theme.code);
    element.setAttribute('spellcheck', 'false');
    const language = this.getLanguage();
    if (language) {
      element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language);
    }
    return {
      element
    };
  }
  static importDOM() {
    return {
      // Typically <pre> is used for code blocks, and <code> for inline code styles
      // but if it's a multi line <code> we'll create a block. Pass through to
      // inline format handled by TextNode otherwise.
      code: node => {
        const isMultiLine = node.textContent != null && (/\r?\n/.test(node.textContent) || hasChildDOMNodeTag(node, 'BR'));
        return isMultiLine ? {
          conversion: $convertPreElement,
          priority: 1
        } : null;
      },
      div: node => ({
        conversion: $convertDivElement,
        priority: 1
      }),
      pre: node => ({
        conversion: $convertPreElement,
        priority: 0
      }),
      table: node => {
        const table = node;
        // domNode is a <table> since we matched it by nodeName
        if (isGitHubCodeTable(table)) {
          return {
            conversion: $convertTableElement,
            priority: 3
          };
        }
        return null;
      },
      td: node => {
        // element is a <td> since we matched it by nodeName
        const td = node;
        const table = td.closest('table');
        if (isGitHubCodeCell(td) || table && isGitHubCodeTable(table)) {
          // Return a no-op if it's a table cell in a code table, but not a code line.
          // Otherwise it'll fall back to the T
          return {
            conversion: convertCodeNoop,
            priority: 3
          };
        }
        return null;
      },
      tr: node => {
        // element is a <tr> since we matched it by nodeName
        const tr = node;
        const table = tr.closest('table');
        if (table && isGitHubCodeTable(table)) {
          return {
            conversion: convertCodeNoop,
            priority: 3
          };
        }
        return null;
      }
    };
  }
  static importJSON(serializedNode) {
    const node = $createCodeNode(serializedNode.language);
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      language: this.getLanguage(),
      type: 'code',
      version: 1
    };
  }

  // Mutation
  insertNewAfter(selection, restoreSelection = true) {
    const children = this.getChildren();
    const childrenLength = children.length;
    if (childrenLength >= 2 && children[childrenLength - 1].getTextContent() === '\n' && children[childrenLength - 2].getTextContent() === '\n' && selection.isCollapsed() && selection.anchor.key === this.__key && selection.anchor.offset === childrenLength) {
      children[childrenLength - 1].remove();
      children[childrenLength - 2].remove();
      const newElement = $createParagraphNode();
      this.insertAfter(newElement, restoreSelection);
      return newElement;
    }

    // If the selection is within the codeblock, find all leading tabs and
    // spaces of the current line. Create a new line that has all those
    // tabs and spaces, such that leading indentation is preserved.
    const {
      anchor,
      focus
    } = selection;
    const firstPoint = anchor.isBefore(focus) ? anchor : focus;
    const firstSelectionNode = firstPoint.getNode();
    if ($isTextNode(firstSelectionNode)) {
      let node = getFirstCodeNodeOfLine(firstSelectionNode);
      const insertNodes = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if ($isTabNode(node)) {
          insertNodes.push($createTabNode());
          node = node.getNextSibling();
        } else if ($isCodeHighlightNode(node)) {
          let spaces = 0;
          const text = node.getTextContent();
          const textSize = node.getTextContentSize();
          while (spaces < textSize && text[spaces] === ' ') {
            spaces++;
          }
          if (spaces !== 0) {
            insertNodes.push($createCodeHighlightNode(' '.repeat(spaces)));
          }
          if (spaces !== textSize) {
            break;
          }
          node = node.getNextSibling();
        } else {
          break;
        }
      }
      const split = firstSelectionNode.splitText(anchor.offset)[0];
      const x = anchor.offset === 0 ? 0 : 1;
      const index = split.getIndexWithinParent() + x;
      const codeNode = firstSelectionNode.getParentOrThrow();
      const nodesToInsert = [$createLineBreakNode(), ...insertNodes];
      codeNode.splice(index, 0, nodesToInsert);
      const last = insertNodes[insertNodes.length - 1];
      if (last) {
        last.select();
      } else if (anchor.offset === 0) {
        split.selectPrevious();
      } else {
        split.getNextSibling().selectNext(0, 0);
      }
    }
    if ($isCodeNode(firstSelectionNode)) {
      const {
        offset
      } = selection.anchor;
      firstSelectionNode.splice(offset, 0, [$createLineBreakNode()]);
      firstSelectionNode.select(offset + 1, offset + 1);
    }
    return null;
  }
  canIndent() {
    return false;
  }
  collapseAtStart() {
    const paragraph = $createParagraphNode();
    const children = this.getChildren();
    children.forEach(child => paragraph.append(child));
    this.replace(paragraph);
    return true;
  }
  setLanguage(language) {
    const writable = this.getWritable();
    writable.__language = mapToPrismLanguage(language);
  }
  getLanguage() {
    return this.getLatest().__language;
  }
}
function $createCodeNode(language) {
  return $applyNodeReplacement(new CodeNode(language));
}
function $isCodeNode(node) {
  return node instanceof CodeNode;
}
function $convertPreElement(domNode) {
  let language;
  if (isHTMLElement(domNode)) {
    language = domNode.getAttribute(LANGUAGE_DATA_ATTRIBUTE);
  }
  return {
    node: $createCodeNode(language)
  };
}
function $convertDivElement(domNode) {
  // domNode is a <div> since we matched it by nodeName
  const div = domNode;
  const isCode = isCodeElement(div);
  if (!isCode && !isCodeChildElement(div)) {
    return {
      node: null
    };
  }
  return {
    node: isCode ? $createCodeNode() : null
  };
}
function $convertTableElement() {
  return {
    node: $createCodeNode()
  };
}
function convertCodeNoop() {
  return {
    node: null
  };
}
function isCodeElement(div) {
  return div.style.fontFamily.match('monospace') !== null;
}
function isCodeChildElement(node) {
  let parent = node.parentElement;
  while (parent !== null) {
    if (isCodeElement(parent)) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}
function isGitHubCodeCell(cell) {
  return cell.classList.contains('js-file-line');
}
function isGitHubCodeTable(table) {
  return table.classList.contains('js-file-line-container');
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const DEFAULT_CODE_LANGUAGE = 'plain';
const CODE_LANGUAGE_FRIENDLY_NAME_MAP = {
  c: 'C',
  clike: 'C-like',
  cpp: 'C++',
  css: 'CSS',
  html: 'HTML',
  java: 'Java',
  js: 'JavaScript',
  markdown: 'Markdown',
  objc: 'Objective-C',
  plain: 'Plain Text',
  powershell: 'PowerShell',
  py: 'Python',
  rust: 'Rust',
  sql: 'SQL',
  swift: 'Swift',
  typescript: 'TypeScript',
  xml: 'XML'
};
const CODE_LANGUAGE_MAP = {
  cpp: 'cpp',
  java: 'java',
  javascript: 'js',
  md: 'markdown',
  plaintext: 'plain',
  python: 'py',
  text: 'plain',
  ts: 'typescript'
};
function normalizeCodeLang(lang) {
  return CODE_LANGUAGE_MAP[lang] || lang;
}
function getLanguageFriendlyName(lang) {
  const _lang = normalizeCodeLang(lang);
  return CODE_LANGUAGE_FRIENDLY_NAME_MAP[_lang] || _lang;
}
const getDefaultCodeLanguage = () => DEFAULT_CODE_LANGUAGE;
const getCodeLanguages = () => Object.keys(window.Prism.languages).filter(
// Prism has several language helpers mixed into languages object
// so filtering them out here to get langs list
language => typeof window.Prism.languages[language] !== 'function').sort();

/** @noInheritDoc */
class CodeHighlightNode extends TextNode {
  /** @internal */

  constructor(text, highlightType, key) {
    super(text, key);
    this.__highlightType = highlightType;
  }
  static getType() {
    return 'code-highlight';
  }
  static clone(node) {
    return new CodeHighlightNode(node.__text, node.__highlightType || undefined, node.__key);
  }
  getHighlightType() {
    const self = this.getLatest();
    return self.__highlightType;
  }
  canHaveFormat() {
    return false;
  }
  createDOM(config) {
    const element = super.createDOM(config);
    const className = getHighlightThemeClass(config.theme, this.__highlightType);
    addClassNamesToElement(element, className);
    return element;
  }
  updateDOM(prevNode, dom, config) {
    const update = super.updateDOM(prevNode, dom, config);
    const prevClassName = getHighlightThemeClass(config.theme, prevNode.__highlightType);
    const nextClassName = getHighlightThemeClass(config.theme, this.__highlightType);
    if (prevClassName !== nextClassName) {
      if (prevClassName) {
        removeClassNamesFromElement(dom, prevClassName);
      }
      if (nextClassName) {
        addClassNamesToElement(dom, nextClassName);
      }
    }
    return update;
  }
  static importJSON(serializedNode) {
    const node = $createCodeHighlightNode(serializedNode.text, serializedNode.highlightType);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      highlightType: this.getHighlightType(),
      type: 'code-highlight',
      version: 1
    };
  }

  // Prevent formatting (bold, underline, etc)
  setFormat(format) {
    return this;
  }
  isParentRequired() {
    return true;
  }
  createParentElementNode() {
    return $createCodeNode();
  }
}
function getHighlightThemeClass(theme, highlightType) {
  return highlightType && theme && theme.codeHighlight && theme.codeHighlight[highlightType];
}
function $createCodeHighlightNode(text, highlightType) {
  return $applyNodeReplacement(new CodeHighlightNode(text, highlightType));
}
function $isCodeHighlightNode(node) {
  return node instanceof CodeHighlightNode;
}
function getFirstCodeNodeOfLine(anchor) {
  let previousNode = anchor;
  let node = anchor;
  while ($isCodeHighlightNode(node) || $isTabNode(node)) {
    previousNode = node;
    node = node.getPreviousSibling();
  }
  return previousNode;
}
function getLastCodeNodeOfLine(anchor) {
  let nextNode = anchor;
  let node = anchor;
  while ($isCodeHighlightNode(node) || $isTabNode(node)) {
    nextNode = node;
    node = node.getNextSibling();
  }
  return nextNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const PrismTokenizer = {
  defaultLanguage: DEFAULT_CODE_LANGUAGE,
  tokenize(code, language) {
    return window.Prism.tokenize(code, window.Prism.languages[language || ''] || window.Prism.languages[this.defaultLanguage]);
  }
};
function getStartOfCodeInLine(anchor, offset) {
  let last = null;
  let lastNonBlank = null;
  let node = anchor;
  let nodeOffset = offset;
  let nodeTextContent = anchor.getTextContent();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (nodeOffset === 0) {
      node = node.getPreviousSibling();
      if (node === null) {
        break;
      }
      if (!($isCodeHighlightNode(node) || $isTabNode(node) || $isLineBreakNode(node))) {
        throw Error(`Expected a valid Code Node: CodeHighlightNode, TabNode, LineBreakNode`);
      }
      if ($isLineBreakNode(node)) {
        last = {
          node,
          offset: 1
        };
        break;
      }
      nodeOffset = Math.max(0, node.getTextContentSize() - 1);
      nodeTextContent = node.getTextContent();
    } else {
      nodeOffset--;
    }
    const character = nodeTextContent[nodeOffset];
    if ($isCodeHighlightNode(node) && character !== ' ') {
      lastNonBlank = {
        node,
        offset: nodeOffset
      };
    }
  }
  // lastNonBlank !== null: anchor in the middle of code; move to line beginning
  if (lastNonBlank !== null) {
    return lastNonBlank;
  }
  // Spaces, tabs or nothing ahead of anchor
  let codeCharacterAtAnchorOffset = null;
  if (offset < anchor.getTextContentSize()) {
    if ($isCodeHighlightNode(anchor)) {
      codeCharacterAtAnchorOffset = anchor.getTextContent()[offset];
    }
  } else {
    const nextSibling = anchor.getNextSibling();
    if ($isCodeHighlightNode(nextSibling)) {
      codeCharacterAtAnchorOffset = nextSibling.getTextContent()[0];
    }
  }
  if (codeCharacterAtAnchorOffset !== null && codeCharacterAtAnchorOffset !== ' ') {
    // Borderline whitespace and code, move to line beginning
    return last;
  } else {
    const nextNonBlank = findNextNonBlankInLine(anchor, offset);
    if (nextNonBlank !== null) {
      return nextNonBlank;
    } else {
      return last;
    }
  }
}
function findNextNonBlankInLine(anchor, offset) {
  let node = anchor;
  let nodeOffset = offset;
  let nodeTextContent = anchor.getTextContent();
  let nodeTextContentSize = anchor.getTextContentSize();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!$isCodeHighlightNode(node) || nodeOffset === nodeTextContentSize) {
      node = node.getNextSibling();
      if (node === null || $isLineBreakNode(node)) {
        return null;
      }
      if ($isCodeHighlightNode(node)) {
        nodeOffset = 0;
        nodeTextContent = node.getTextContent();
        nodeTextContentSize = node.getTextContentSize();
      }
    }
    if ($isCodeHighlightNode(node)) {
      if (nodeTextContent[nodeOffset] !== ' ') {
        return {
          node,
          offset: nodeOffset
        };
      }
      nodeOffset++;
    }
  }
}
function getEndOfCodeInLine(anchor) {
  const lastNode = getLastCodeNodeOfLine(anchor);
  if (!!$isLineBreakNode(lastNode)) {
    throw Error(`Unexpected lineBreakNode in getEndOfCodeInLine`);
  }
  return lastNode;
}
function $textNodeTransform(node, editor, tokenizer) {
  // Since CodeNode has flat children structure we only need to check
  // if node's parent is a code node and run highlighting if so
  const parentNode = node.getParent();
  if ($isCodeNode(parentNode)) {
    codeNodeTransform(parentNode, editor, tokenizer);
  } else if ($isCodeHighlightNode(node)) {
    // When code block converted into paragraph or other element
    // code highlight nodes converted back to normal text
    node.replace($createTextNode(node.__text));
  }
}
function updateCodeGutter(node, editor) {
  const codeElement = editor.getElementByKey(node.getKey());
  if (codeElement === null) {
    return;
  }
  const children = node.getChildren();
  const childrenLength = children.length;
  // @ts-ignore: internal field
  if (childrenLength === codeElement.__cachedChildrenLength) {
    // Avoid updating the attribute if the children length hasn't changed.
    return;
  }
  // @ts-ignore:: internal field
  codeElement.__cachedChildrenLength = childrenLength;
  let gutter = '1';
  let count = 1;
  for (let i = 0; i < childrenLength; i++) {
    if ($isLineBreakNode(children[i])) {
      gutter += '\n' + ++count;
    }
  }
  codeElement.setAttribute('data-gutter', gutter);
}

// Using `skipTransforms` to prevent extra transforms since reformatting the code
// will not affect code block content itself.
//
// Using extra cache (`nodesCurrentlyHighlighting`) since both CodeNode and CodeHighlightNode
// transforms might be called at the same time (e.g. new CodeHighlight node inserted) and
// in both cases we'll rerun whole reformatting over CodeNode, which is redundant.
// Especially when pasting code into CodeBlock.

const nodesCurrentlyHighlighting = new Set();
function codeNodeTransform(node, editor, tokenizer) {
  const nodeKey = node.getKey();
  if (nodesCurrentlyHighlighting.has(nodeKey)) {
    return;
  }
  nodesCurrentlyHighlighting.add(nodeKey);

  // When new code block inserted it might not have language selected
  // if (node.getLanguage() === undefined) {
  //   node.setLanguage(tokenizer.defaultLanguage);
  // }

  // Using nested update call to pass `skipTransforms` since we don't want
  // each individual codehighlight node to be transformed again as it's already
  // in its final state
  editor.update(() => {
    $updateAndRetainSelection(nodeKey, () => {
      const currentNode = $getNodeByKey(nodeKey);
      if (!$isCodeNode(currentNode) || !currentNode.isAttached()) {
        return false;
      }
      const code = currentNode.getTextContent();
      const tokens = tokenizer.tokenize(code, currentNode.getLanguage() || tokenizer.defaultLanguage);
      const highlightNodes = $getHighlightNodes(tokens);
      const diffRange = getDiffRange(currentNode.getChildren(), highlightNodes);
      const {
        from,
        to,
        nodesForReplacement
      } = diffRange;
      if (from !== to || nodesForReplacement.length) {
        node.splice(from, to - from, nodesForReplacement);
        return true;
      }
      return false;
    });
  }, {
    onUpdate: () => {
      nodesCurrentlyHighlighting.delete(nodeKey);
    },
    skipTransforms: true
  });
}
function $getHighlightNodes(tokens, type) {
  const nodes = [];
  for (const token of tokens) {
    if (typeof token === 'string') {
      const partials = token.split(/(\n|\t)/);
      const partialsLength = partials.length;
      for (let i = 0; i < partialsLength; i++) {
        const part = partials[i];
        if (part === '\n' || part === '\r\n') {
          nodes.push($createLineBreakNode());
        } else if (part === '\t') {
          nodes.push($createTabNode());
        } else if (part.length > 0) {
          nodes.push($createCodeHighlightNode(part, type));
        }
      }
    } else {
      const {
        content
      } = token;
      if (typeof content === 'string') {
        nodes.push(...$getHighlightNodes([content], token.type));
      } else if (Array.isArray(content)) {
        nodes.push(...$getHighlightNodes(content, token.type));
      }
    }
  }
  return nodes;
}

// Wrapping update function into selection retainer, that tries to keep cursor at the same
// position as before.
function $updateAndRetainSelection(nodeKey, updateFn) {
  const node = $getNodeByKey(nodeKey);
  if (!$isCodeNode(node) || !node.isAttached()) {
    return;
  }
  const selection = $getSelection();
  // If it's not range selection (or null selection) there's no need to change it,
  // but we can still run highlighting logic
  if (!$isRangeSelection(selection)) {
    updateFn();
    return;
  }
  const anchor = selection.anchor;
  const anchorOffset = anchor.offset;
  const isNewLineAnchor = anchor.type === 'element' && $isLineBreakNode(node.getChildAtIndex(anchor.offset - 1));
  let textOffset = 0;

  // Calculating previous text offset (all text node prior to anchor + anchor own text offset)
  if (!isNewLineAnchor) {
    const anchorNode = anchor.getNode();
    textOffset = anchorOffset + anchorNode.getPreviousSiblings().reduce((offset, _node) => {
      return offset + _node.getTextContentSize();
    }, 0);
  }
  const hasChanges = updateFn();
  if (!hasChanges) {
    return;
  }

  // Non-text anchors only happen for line breaks, otherwise
  // selection will be within text node (code highlight node)
  if (isNewLineAnchor) {
    anchor.getNode().select(anchorOffset, anchorOffset);
    return;
  }

  // If it was non-element anchor then we walk through child nodes
  // and looking for a position of original text offset
  node.getChildren().some(_node => {
    const isText = $isTextNode(_node);
    if (isText || $isLineBreakNode(_node)) {
      const textContentSize = _node.getTextContentSize();
      if (isText && textContentSize >= textOffset) {
        _node.select(textOffset, textOffset);
        return true;
      }
      textOffset -= textContentSize;
    }
    return false;
  });
}

// Finds minimal diff range between two nodes lists. It returns from/to range boundaries of prevNodes
// that needs to be replaced with `nodes` (subset of nextNodes) to make prevNodes equal to nextNodes.
function getDiffRange(prevNodes, nextNodes) {
  let leadingMatch = 0;
  while (leadingMatch < prevNodes.length) {
    if (!isEqual(prevNodes[leadingMatch], nextNodes[leadingMatch])) {
      break;
    }
    leadingMatch++;
  }
  const prevNodesLength = prevNodes.length;
  const nextNodesLength = nextNodes.length;
  const maxTrailingMatch = Math.min(prevNodesLength, nextNodesLength) - leadingMatch;
  let trailingMatch = 0;
  while (trailingMatch < maxTrailingMatch) {
    trailingMatch++;
    if (!isEqual(prevNodes[prevNodesLength - trailingMatch], nextNodes[nextNodesLength - trailingMatch])) {
      trailingMatch--;
      break;
    }
  }
  const from = leadingMatch;
  const to = prevNodesLength - trailingMatch;
  const nodesForReplacement = nextNodes.slice(leadingMatch, nextNodesLength - trailingMatch);
  return {
    from,
    nodesForReplacement,
    to
  };
}
function isEqual(nodeA, nodeB) {
  // Only checking for code higlight nodes, tabs and linebreaks. If it's regular text node
  // returning false so that it's transformed into code highlight node
  return $isCodeHighlightNode(nodeA) && $isCodeHighlightNode(nodeB) && nodeA.__text === nodeB.__text && nodeA.__highlightType === nodeB.__highlightType || $isTabNode(nodeA) && $isTabNode(nodeB) || $isLineBreakNode(nodeA) && $isLineBreakNode(nodeB);
}
function $isSelectionInCode(selection) {
  if (!$isRangeSelection(selection)) {
    return false;
  }
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode.is(focusNode) && $isCodeNode(anchorNode)) {
    return true;
  }
  const anchorParent = anchorNode.getParent();
  return $isCodeNode(anchorParent) && anchorParent.is(focusNode.getParent());
}
function $getCodeLines(selection) {
  const nodes = selection.getNodes();
  const lines = [[]];
  if (nodes.length === 1 && $isCodeNode(nodes[0])) {
    return lines;
  }
  let lastLine = lines[0];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!($isCodeHighlightNode(node) || $isTabNode(node) || $isLineBreakNode(node))) {
      throw Error(`Expected selection to be inside CodeBlock and consisting of CodeHighlightNode, TabNode and LineBreakNode`);
    }
    if ($isLineBreakNode(node)) {
      if (i !== 0 && lastLine.length > 0) {
        lastLine = [];
        lines.push(lastLine);
      }
    } else {
      lastLine.push(node);
    }
  }
  return lines;
}
function $handleTab(shiftKey) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !$isSelectionInCode(selection)) {
    return null;
  }
  const indentOrOutdent = !shiftKey ? INDENT_CONTENT_COMMAND : OUTDENT_CONTENT_COMMAND;
  const tabOrOutdent = !shiftKey ? INSERT_TAB_COMMAND : OUTDENT_CONTENT_COMMAND;
  // 1. If multiple lines selected: indent/outdent
  const codeLines = $getCodeLines(selection);
  if (codeLines.length > 1) {
    return indentOrOutdent;
  }
  // 2. If entire line selected: indent/outdent
  const selectionNodes = selection.getNodes();
  const firstNode = selectionNodes[0];
  if (!($isCodeNode(firstNode) || $isCodeHighlightNode(firstNode) || $isTabNode(firstNode) || $isLineBreakNode(firstNode))) {
    throw Error(`Expected selection firstNode to be CodeHighlightNode or TabNode`);
  }
  if ($isCodeNode(firstNode)) {
    return indentOrOutdent;
  }
  const firstOfLine = getFirstCodeNodeOfLine(firstNode);
  const lastOfLine = getLastCodeNodeOfLine(firstNode);
  const anchor = selection.anchor;
  const focus = selection.focus;
  let selectionFirst;
  let selectionLast;
  if (focus.isBefore(anchor)) {
    selectionFirst = focus;
    selectionLast = anchor;
  } else {
    selectionFirst = anchor;
    selectionLast = focus;
  }
  if (firstOfLine !== null && lastOfLine !== null && selectionFirst.key === firstOfLine.getKey() && selectionFirst.offset === 0 && selectionLast.key === lastOfLine.getKey() && selectionLast.offset === lastOfLine.getTextContentSize()) {
    return indentOrOutdent;
  }
  // 3. Else: tab/outdent
  return tabOrOutdent;
}
function $handleMultilineIndent(type) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection) || !$isSelectionInCode(selection)) {
    return false;
  }
  const codeLines = $getCodeLines(selection);
  const codeLinesLength = codeLines.length;
  // Multiple lines selection
  if (codeLines.length > 1) {
    for (let i = 0; i < codeLinesLength; i++) {
      const line = codeLines[i];
      if (line.length > 0) {
        let firstOfLine = line[0];
        // First and last lines might not be complete
        if (i === 0) {
          firstOfLine = getFirstCodeNodeOfLine(firstOfLine);
        }
        if (firstOfLine !== null) {
          if (type === INDENT_CONTENT_COMMAND) {
            firstOfLine.insertBefore($createTabNode());
          } else if ($isTabNode(firstOfLine)) {
            firstOfLine.remove();
          }
        }
      }
    }
    return true;
  }
  // Just one line
  const selectionNodes = selection.getNodes();
  const firstNode = selectionNodes[0];
  if (!($isCodeNode(firstNode) || $isCodeHighlightNode(firstNode) || $isTabNode(firstNode) || $isLineBreakNode(firstNode))) {
    throw Error(`Expected selection firstNode to be CodeHighlightNode or CodeTabNode`);
  }
  if ($isCodeNode(firstNode)) {
    // CodeNode is empty
    if (type === INDENT_CONTENT_COMMAND) {
      selection.insertNodes([$createTabNode()]);
    }
    return true;
  }
  const firstOfLine = getFirstCodeNodeOfLine(firstNode);
  if (!(firstOfLine !== null)) {
    throw Error(`Expected getFirstCodeNodeOfLine to return a valid Code Node`);
  }
  if (type === INDENT_CONTENT_COMMAND) {
    if ($isLineBreakNode(firstOfLine)) {
      firstOfLine.insertAfter($createTabNode());
    } else {
      firstOfLine.insertBefore($createTabNode());
    }
  } else if ($isTabNode(firstOfLine)) {
    firstOfLine.remove();
  }
  return true;
}
function $handleShiftLines(type, event) {
  // We only care about the alt+arrow keys
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return false;
  }

  // I'm not quite sure why, but it seems like calling anchor.getNode() collapses the selection here
  // So first, get the anchor and the focus, then get their nodes
  const {
    anchor,
    focus
  } = selection;
  const anchorOffset = anchor.offset;
  const focusOffset = focus.offset;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  const arrowIsUp = type === KEY_ARROW_UP_COMMAND;

  // Ensure the selection is within the codeblock
  if (!$isSelectionInCode(selection) || !($isCodeHighlightNode(anchorNode) || $isTabNode(anchorNode)) || !($isCodeHighlightNode(focusNode) || $isTabNode(focusNode))) {
    return false;
  }
  if (!event.altKey) {
    // Handle moving selection out of the code block, given there are no
    // sibling thats can natively take the selection.
    if (selection.isCollapsed()) {
      const codeNode = anchorNode.getParentOrThrow();
      if (arrowIsUp && anchorOffset === 0 && anchorNode.getPreviousSibling() === null) {
        const codeNodeSibling = codeNode.getPreviousSibling();
        if (codeNodeSibling === null) {
          codeNode.selectPrevious();
          event.preventDefault();
          return true;
        }
      } else if (!arrowIsUp && anchorOffset === anchorNode.getTextContentSize() && anchorNode.getNextSibling() === null) {
        const codeNodeSibling = codeNode.getNextSibling();
        if (codeNodeSibling === null) {
          codeNode.selectNext();
          event.preventDefault();
          return true;
        }
      }
    }
    return false;
  }
  let start;
  let end;
  if (anchorNode.isBefore(focusNode)) {
    start = getFirstCodeNodeOfLine(anchorNode);
    end = getLastCodeNodeOfLine(focusNode);
  } else {
    start = getFirstCodeNodeOfLine(focusNode);
    end = getLastCodeNodeOfLine(anchorNode);
  }
  if (start == null || end == null) {
    return false;
  }
  const range = start.getNodesBetween(end);
  for (let i = 0; i < range.length; i++) {
    const node = range[i];
    if (!$isCodeHighlightNode(node) && !$isTabNode(node) && !$isLineBreakNode(node)) {
      return false;
    }
  }

  // After this point, we know the selection is within the codeblock. We may not be able to
  // actually move the lines around, but we want to return true either way to prevent
  // the event's default behavior
  event.preventDefault();
  event.stopPropagation(); // required to stop cursor movement under Firefox

  const linebreak = arrowIsUp ? start.getPreviousSibling() : end.getNextSibling();
  if (!$isLineBreakNode(linebreak)) {
    return true;
  }
  const sibling = arrowIsUp ? linebreak.getPreviousSibling() : linebreak.getNextSibling();
  if (sibling == null) {
    return true;
  }
  const maybeInsertionPoint = $isCodeHighlightNode(sibling) || $isTabNode(sibling) || $isLineBreakNode(sibling) ? arrowIsUp ? getFirstCodeNodeOfLine(sibling) : getLastCodeNodeOfLine(sibling) : null;
  let insertionPoint = maybeInsertionPoint != null ? maybeInsertionPoint : sibling;
  linebreak.remove();
  range.forEach(node => node.remove());
  if (type === KEY_ARROW_UP_COMMAND) {
    range.forEach(node => insertionPoint.insertBefore(node));
    insertionPoint.insertBefore(linebreak);
  } else {
    insertionPoint.insertAfter(linebreak);
    insertionPoint = linebreak;
    range.forEach(node => {
      insertionPoint.insertAfter(node);
      insertionPoint = node;
    });
  }
  selection.setTextNodeRange(anchorNode, anchorOffset, focusNode, focusOffset);
  return true;
}
function $handleMoveTo(type, event) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return false;
  }
  const {
    anchor,
    focus
  } = selection;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  const isMoveToStart = type === MOVE_TO_START;
  if (!($isCodeHighlightNode(anchorNode) || $isTabNode(anchorNode)) || !($isCodeHighlightNode(focusNode) || $isTabNode(focusNode))) {
    return false;
  }
  if (isMoveToStart) {
    const start = getStartOfCodeInLine(focusNode, focus.offset);
    if (start !== null) {
      const {
        node,
        offset
      } = start;
      if ($isLineBreakNode(node)) {
        node.selectNext(0, 0);
      } else {
        selection.setTextNodeRange(node, offset, node, offset);
      }
    } else {
      focusNode.getParentOrThrow().selectStart();
    }
  } else {
    const node = getEndOfCodeInLine(focusNode);
    node.select();
  }
  event.preventDefault();
  event.stopPropagation();
  return true;
}
function registerCodeHighlighting(editor, tokenizer) {
  if (!editor.hasNodes([CodeNode, CodeHighlightNode])) {
    throw new Error('CodeHighlightPlugin: CodeNode or CodeHighlightNode not registered on editor');
  }
  if (tokenizer == null) {
    tokenizer = PrismTokenizer;
  }
  return mergeRegister(editor.registerMutationListener(CodeNode, mutations => {
    editor.update(() => {
      for (const [key, type] of mutations) {
        if (type !== 'destroyed') {
          const node = $getNodeByKey(key);
          if (node !== null) {
            updateCodeGutter(node, editor);
          }
        }
      }
    });
  }), editor.registerNodeTransform(CodeNode, node => codeNodeTransform(node, editor, tokenizer)), editor.registerNodeTransform(TextNode, node => $textNodeTransform(node, editor, tokenizer)), editor.registerNodeTransform(CodeHighlightNode, node => $textNodeTransform(node, editor, tokenizer)), editor.registerCommand(KEY_TAB_COMMAND, event => {
    const command = $handleTab(event.shiftKey);
    if (command === null) {
      return false;
    }
    event.preventDefault();
    editor.dispatchCommand(command, undefined);
    return true;
  }, COMMAND_PRIORITY_LOW), editor.registerCommand(INSERT_TAB_COMMAND, () => {
    const selection = $getSelection();
    if (!$isSelectionInCode(selection)) {
      return false;
    }
    $insertNodes([$createTabNode()]);
    return true;
  }, COMMAND_PRIORITY_LOW), editor.registerCommand(INDENT_CONTENT_COMMAND, payload => $handleMultilineIndent(INDENT_CONTENT_COMMAND), COMMAND_PRIORITY_LOW), editor.registerCommand(OUTDENT_CONTENT_COMMAND, payload => $handleMultilineIndent(OUTDENT_CONTENT_COMMAND), COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ARROW_UP_COMMAND, payload => $handleShiftLines(KEY_ARROW_UP_COMMAND, payload), COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_ARROW_DOWN_COMMAND, payload => $handleShiftLines(KEY_ARROW_DOWN_COMMAND, payload), COMMAND_PRIORITY_LOW), editor.registerCommand(MOVE_TO_END, payload => $handleMoveTo(MOVE_TO_END, payload), COMMAND_PRIORITY_LOW), editor.registerCommand(MOVE_TO_START, payload => $handleMoveTo(MOVE_TO_START, payload), COMMAND_PRIORITY_LOW));
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export { $createCodeHighlightNode, $createCodeNode, $isCodeHighlightNode, $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP, CodeHighlightNode, CodeNode, DEFAULT_CODE_LANGUAGE, PrismTokenizer, getCodeLanguages, getDefaultCodeLanguage, getEndOfCodeInLine, getFirstCodeNodeOfLine, getLanguageFriendlyName, getLastCodeNodeOfLine, getStartOfCodeInLine, normalizeCodeLang, registerCodeHighlighting };
