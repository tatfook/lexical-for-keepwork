/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict'
const LexicalCollaborationPlugin = ['development', 'test'].includes(process.env.NODE_ENV) ? require('./LexicalCollaborationPlugin.dev.js') : require('./LexicalCollaborationPlugin.prod.js');
module.exports = LexicalCollaborationPlugin;