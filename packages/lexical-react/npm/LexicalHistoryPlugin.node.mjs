/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalHistoryPlugin.dev.mjs') : import('./LexicalHistoryPlugin.prod.mjs'));
export const HistoryPlugin = mod.HistoryPlugin;
export const createEmptyHistoryState = mod.createEmptyHistoryState;