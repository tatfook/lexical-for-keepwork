/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalComposerContext.dev.mjs') : import('./LexicalComposerContext.prod.mjs'));
export const LexicalComposerContext = mod.LexicalComposerContext;
export const createLexicalComposerContext = mod.createLexicalComposerContext;
export const useLexicalComposerContext = mod.useLexicalComposerContext;