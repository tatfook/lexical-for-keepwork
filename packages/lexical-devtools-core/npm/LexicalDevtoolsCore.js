/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict'
const LexicalDevtoolsCore = ['development', 'test'].includes(process.env.NODE_ENV) ? require('./LexicalDevtoolsCore.dev.js') : require('./LexicalDevtoolsCore.prod.js');
module.exports = LexicalDevtoolsCore;