/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { EditorState, EditorThemeClasses, HTMLConfig, Klass, LexicalEditor, LexicalNode, LexicalNodeReplacement } from 'lexical';
import * as React from 'react';
export type InitialEditorStateType = null | string | EditorState | ((editor: LexicalEditor) => void);
export type InitialConfigType = Readonly<{
    editor__DEPRECATED?: LexicalEditor | null;
    namespace: string;
    nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
    onError: (error: Error, editor: LexicalEditor) => void;
    editable?: boolean;
    theme?: EditorThemeClasses;
    editorState?: InitialEditorStateType;
    ignoreMutationDOMChanges?: (node: Node) => boolean;
    html?: HTMLConfig;
}>;
type Props = React.PropsWithChildren<{
    initialConfig: InitialConfigType;
}>;
export declare function LexicalComposer({ initialConfig, children }: Props): JSX.Element;
export {};
