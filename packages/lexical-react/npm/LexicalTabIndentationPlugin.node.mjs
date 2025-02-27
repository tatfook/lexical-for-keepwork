/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalTabIndentationPlugin.dev.mjs') : import('./LexicalTabIndentationPlugin.prod.mjs'));
export const TabIndentationPlugin = mod.TabIndentationPlugin;
export const registerTabIndentation = mod.registerTabIndentation;