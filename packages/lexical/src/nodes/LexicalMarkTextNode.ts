/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {EditorConfig, LexicalEditor} from '../LexicalEditor';
import {LexicalNode, NodeKey} from '../LexicalNode';
import {$isTextNode, TextFormatType, TextNode} from "./LexicalTextNode";
import {IS_MARK} from "../LexicalConstants";


export class MarkTextNode extends TextNode {
  __text

  static getType() {
    return 'mark-text'
  }

  static clone(node: MarkTextNode) {
    return new MarkTextNode(node.__text, node.__key)
  }

  constructor(text: string, key?: NodeKey) {
    super(key)
    this.__text = text
    this.__format = IS_MARK
  }

  setFormat(format: TextFormatType | number): this {
    console.warn('MarkTextNode.setFormat() is not supported')
    return this;
  }

  setTextContent(text: string): this {
    this.markDirty()
    const next = this.getNextSibling()
    if (!next || !$isTextNode(next)) {
      return this
    }
    next.setTextContent(text.substring(this.__text.length) + next.getTextContent())
    next.select(1, 1)

    return this;
  }

}

export function $createMarkTextNode(text: string) {
  return new MarkTextNode(text)
}

export function $isMarkTextNode(node: LexicalNode | null | undefined): node is MarkTextNode {
  return node instanceof MarkTextNode
}

