/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalOffset.dev.mjs') : import('./LexicalOffset.prod.mjs'));
export const $createChildrenArray = mod.$createChildrenArray;
export const $createOffsetView = mod.$createOffsetView;
export const OffsetView = mod.OffsetView;
export const createChildrenArray = mod.createChildrenArray;