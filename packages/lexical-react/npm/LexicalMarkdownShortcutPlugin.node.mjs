/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalMarkdownShortcutPlugin.dev.mjs') : import('./LexicalMarkdownShortcutPlugin.prod.mjs'));
export const DEFAULT_TRANSFORMERS = mod.DEFAULT_TRANSFORMERS;
export const MarkdownShortcutPlugin = mod.MarkdownShortcutPlugin;