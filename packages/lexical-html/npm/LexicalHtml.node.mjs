/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalHtml.dev.mjs') : import('./LexicalHtml.prod.mjs'));
export const $generateHtmlFromNodes = mod.$generateHtmlFromNodes;
export const $generateNodesFromDOM = mod.$generateNodesFromDOM;