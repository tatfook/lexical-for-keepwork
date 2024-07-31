/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalYjs.dev.mjs') : import('./LexicalYjs.prod.mjs'));
export const CONNECTED_COMMAND = mod.CONNECTED_COMMAND;
export const TOGGLE_CONNECT_COMMAND = mod.TOGGLE_CONNECT_COMMAND;
export const createBinding = mod.createBinding;
export const createUndoManager = mod.createUndoManager;
export const initLocalState = mod.initLocalState;
export const setLocalStateFocus = mod.setLocalStateFocus;
export const syncCursorPositions = mod.syncCursorPositions;
export const syncLexicalUpdateToYjs = mod.syncLexicalUpdateToYjs;
export const syncYjsChangesToLexical = mod.syncYjsChangesToLexical;