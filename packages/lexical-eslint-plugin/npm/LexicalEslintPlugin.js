/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict'
const LexicalEslintPlugin = ['development', 'test'].includes(process.env.NODE_ENV) ? require('./LexicalEslintPlugin.dev.js') : require('./LexicalEslintPlugin.prod.js');
module.exports = LexicalEslintPlugin;