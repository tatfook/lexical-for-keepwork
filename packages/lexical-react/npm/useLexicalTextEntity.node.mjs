/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./useLexicalTextEntity.dev.mjs') : import('./useLexicalTextEntity.prod.mjs'));
export const useLexicalTextEntity = mod.useLexicalTextEntity;