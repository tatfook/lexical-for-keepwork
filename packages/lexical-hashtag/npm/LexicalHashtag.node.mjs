/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalHashtag.dev.mjs') : import('./LexicalHashtag.prod.mjs'));
export const $createHashtagNode = mod.$createHashtagNode;
export const $isHashtagNode = mod.$isHashtagNode;
export const HashtagNode = mod.HashtagNode;