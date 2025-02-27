/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalOverflow.dev.mjs') : import('./LexicalOverflow.prod.mjs'));
export const $createOverflowNode = mod.$createOverflowNode;
export const $isOverflowNode = mod.$isOverflowNode;
export const OverflowNode = mod.OverflowNode;