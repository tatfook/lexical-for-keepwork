/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$isHeadingNode, HeadingNode} from '@lexical/rich-text';
import {
  $createMarkTextNode, $getNodeByKey, $getRoot,
  $isMarkTextNode,
  $isRangeSelection,
  EditorState, LexicalNode
} from 'lexical';
import {useEffect} from 'react';

// Recursion
function $getParentRecursion(node: LexicalNode, stopNode: LexicalNode) {
  if (node.getParent() === stopNode) {
    return node
  }
  const parent = node.getParent()
  if (parent === null) {
    return node
  }
  return $getParentRecursion(parent, stopNode)
}

function getHeadingInAnchor(editorState: EditorState) {
  const selection = editorState._selection
  if (!selection || !$isRangeSelection(selection)) {
    return
  }
  const selectionAnchorNode = editorState.read(() => {
    const node = selection.anchor.getNode()
    return $getParentRecursion(node, $getRoot())
  })
  if ($isHeadingNode(selectionAnchorNode)) {
    return selectionAnchorNode.getKey()
  }
}

function $addMarkTextNode(headingNode: HeadingNode) {
  const tag = headingNode.getTag()
  // h1 to #, h2 to ##
  let newMarkTextNode
  if (tag === 'h1') {
    newMarkTextNode = $createMarkTextNode('# ')
  } else if (tag === 'h2') {
    newMarkTextNode = $createMarkTextNode('## ')
  } else if (tag === 'h3') {
    newMarkTextNode = $createMarkTextNode('### ')
  } else if (tag === 'h4') {
    newMarkTextNode = $createMarkTextNode('#### ')
  } else if (tag === 'h5') {
    newMarkTextNode = $createMarkTextNode('##### ')
  } else {
    newMarkTextNode = $createMarkTextNode('###### ')
  }
  if (headingNode.getChildrenSize() === 0) {
    headingNode.append(newMarkTextNode)
  } else {
    headingNode.getChildAtIndex(0)!.insertBefore(newMarkTextNode)
  }
}

function $deleteMarkTextNode(headingNode: HeadingNode) {
  if (headingNode.getChildrenSize() === 0) {
    return
  } else if ($isMarkTextNode(headingNode.getChildAtIndex(0))) {
    headingNode.getChildAtIndex(0)!.remove()
  }
}

export function HeadingMarkText() {
  const [editor] = useLexicalComposerContext()


  useEffect(() => {
    return editor.registerUpdateListener(({prevEditorState}) => {
      const prevHeadingNodeKey = getHeadingInAnchor(prevEditorState)
      const currentHeadingNodeKey = getHeadingInAnchor(editor._editorState)
      if (editor.getEditorState().read(() => currentHeadingNodeKey === prevHeadingNodeKey)) {
        return
      }
      editor.update(() => {
        if (currentHeadingNodeKey) {
          const node = $getNodeByKey(currentHeadingNodeKey) as HeadingNode;
          const firstChild = node?.getFirstChild();
          if (node && !$isMarkTextNode(firstChild)) {
            $addMarkTextNode(node);
          }
        }

        if (prevHeadingNodeKey) {
          const node = $getNodeByKey(prevHeadingNodeKey) as HeadingNode;
          if (node && $isMarkTextNode(node?.getFirstChild())) {
            // 当前存在MarkTextNode则删除
            $deleteMarkTextNode(node)
            return
          }
        }
      })

      /*// find heading node key
      const headingNodeKey = editor.getEditorState().read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          console.warn('not range or is not collapsed', selection)
          return null
        }
        const anchorNode = selection.anchor.getNode()
        const anchorNodeTopLevelElement = anchorNode.getTopLevelElement()
        let key = null
        if ($isHeadingNode(anchorNode)) {
          key = anchorNode.getKey()
        }
        if (anchorNodeTopLevelElement && $isHeadingNode(anchorNodeTopLevelElement)) {
          key = anchorNodeTopLevelElement.getKey()
        }
        if (key) {
          const node = $getNodeByKey(key)
          if (!node) {
            console.warn('cannot find node', key)
            return null
          }
          const firstChild = node.getChildAtIndex(0)
          if (firstChild && $isMarkTextNode(firstChild)) {
            console.warn('firstChild is MarkTextNode', firstChild)
            return null
          } else {
            return key
          }
        }
        return null
      })
      if (!headingNodeKey) {
        return
      }
      editor.update(() => {
        const headingNode = $getNodeByKey(headingNodeKey)
        if (!headingNode) {
          return
        }
        const tag = headingNode.getTag()
        // h1 to #, h2 to ##
        let newMarkTextNode
        if (tag === 'h1') {
          newMarkTextNode = $createMarkTextNode('#')
        }
        if (tag === 'h2') {
          newMarkTextNode = $createMarkTextNode('##')
        }
        if (tag === 'h3') {
          newMarkTextNode = $createMarkTextNode('###')
        }
        if (tag === 'h4') {
          newMarkTextNode = $createMarkTextNode('####')
        }
        if (tag === 'h5') {
          newMarkTextNode = $createMarkTextNode('#####')
        }
        if (tag === 'h6') {
          newMarkTextNode = $createMarkTextNode('######')
        }
        if (headingNode.getChildrenSize() === 0) {
          headingNode.append(newMarkTextNode)
        } else {
          headingNode.getChildAtIndex(0).insertBefore(newMarkTextNode)
        }
      })*/
    })
  }, [editor])

  return null
}
