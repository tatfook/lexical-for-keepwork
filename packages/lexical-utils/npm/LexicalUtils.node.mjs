/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalUtils.dev.mjs') : import('./LexicalUtils.prod.mjs'));
export const $dfs = mod.$dfs;
export const $filter = mod.$filter;
export const $findMatchingParent = mod.$findMatchingParent;
export const $getNearestBlockElementAncestorOrThrow = mod.$getNearestBlockElementAncestorOrThrow;
export const $getNearestNodeOfType = mod.$getNearestNodeOfType;
export const $getNextRightPreorderNode = mod.$getNextRightPreorderNode;
export const $insertFirst = mod.$insertFirst;
export const $insertNodeToNearestRoot = mod.$insertNodeToNearestRoot;
export const $restoreEditorState = mod.$restoreEditorState;
export const $splitNode = mod.$splitNode;
export const $wrapNodeInElement = mod.$wrapNodeInElement;
export const CAN_USE_BEFORE_INPUT = mod.CAN_USE_BEFORE_INPUT;
export const CAN_USE_DOM = mod.CAN_USE_DOM;
export const IS_ANDROID = mod.IS_ANDROID;
export const IS_ANDROID_CHROME = mod.IS_ANDROID_CHROME;
export const IS_APPLE = mod.IS_APPLE;
export const IS_APPLE_WEBKIT = mod.IS_APPLE_WEBKIT;
export const IS_CHROME = mod.IS_CHROME;
export const IS_FIREFOX = mod.IS_FIREFOX;
export const IS_IOS = mod.IS_IOS;
export const IS_SAFARI = mod.IS_SAFARI;
export const addClassNamesToElement = mod.addClassNamesToElement;
export const calculateZoomLevel = mod.calculateZoomLevel;
export const isBlockDomNode = mod.isBlockDomNode;
export const isHTMLAnchorElement = mod.isHTMLAnchorElement;
export const isHTMLElement = mod.isHTMLElement;
export const isInlineDomNode = mod.isInlineDomNode;
export const isMimeType = mod.isMimeType;
export const markSelection = mod.markSelection;
export const mediaFileReader = mod.mediaFileReader;
export const mergeRegister = mod.mergeRegister;
export const objectKlassEquals = mod.objectKlassEquals;
export const positionNodeOnRange = mod.positionNodeOnRange;
export const registerNestedElementResolver = mod.registerNestedElementResolver;
export const removeClassNamesFromElement = mod.removeClassNamesFromElement;