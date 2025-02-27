/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalNodeMenuPlugin.dev.mjs') : import('./LexicalNodeMenuPlugin.prod.mjs'));
export const LexicalNodeMenuPlugin = mod.LexicalNodeMenuPlugin;
export const MenuOption = mod.MenuOption;