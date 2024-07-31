/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { EditorSetOptions, EditorState } from 'lexical';
import * as React from 'react';
export declare const TreeView: React.ForwardRefExoticComponent<{
    editorState: EditorState;
    treeTypeButtonClassName: string;
    timeTravelButtonClassName: string;
    timeTravelPanelButtonClassName: string;
    timeTravelPanelClassName: string;
    timeTravelPanelSliderClassName: string;
    viewClassName: string;
    generateContent: (exportDOM: boolean) => Promise<string>;
    setEditorState: (state: EditorState, options?: EditorSetOptions) => void;
    setEditorReadOnly: (isReadonly: boolean) => void;
} & React.RefAttributes<HTMLPreElement>>;
