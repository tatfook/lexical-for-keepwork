/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{createLexicalComposerContext as e,LexicalComposerContext as t}from"@lexical/react/LexicalComposerContext";import{createEditor as o,$getRoot as n,$createParagraphNode as i,$getSelection as r}from"lexical";import*as a from"react";import{useLayoutEffect as l,useEffect as c,useMemo as s}from"react";const d="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,m=d?l:c,u={tag:"history-merge"};function p({initialConfig:l,children:c}){const p=s((()=>{const{theme:t,namespace:a,editor__DEPRECATED:c,nodes:s,onError:m,editorState:p,html:f}=l,E=e(null,t);let g=c||null;if(null===g){const e=o({editable:l.editable,ignoreMutationDOMChanges:l.ignoreMutationDOMChanges,html:f,namespace:a,nodes:s,onError:t=>m(t,e),theme:t});!function(e,t){if(null===t)return;if(void 0===t)e.update((()=>{const t=n();if(t.isEmpty()){const o=i();t.append(o);const n=d?document.activeElement:null;(null!==r()||null!==n&&n===e.getRootElement())&&o.select()}}),u);else if(null!==t)switch(typeof t){case"string":{const o=e.parseEditorState(t);e.setEditorState(o,u);break}case"object":e.setEditorState(t,u);break;case"function":e.update((()=>{n().isEmpty()&&t(e)}),u)}}(e,p),g=e}return[g,E]}),[]);return m((()=>{const e=l.editable,[t]=p;t.setEditable(void 0===e||e)}),[]),a.createElement(t.Provider,{value:p},c)}export{p as LexicalComposer};
