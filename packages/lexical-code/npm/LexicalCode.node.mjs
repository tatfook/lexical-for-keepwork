/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const mod = await (['development', 'test'].includes(process.env.NODE_ENV) ? import('./LexicalCode.dev.mjs') : import('./LexicalCode.prod.mjs'));
export const $createCodeHighlightNode = mod.$createCodeHighlightNode;
export const $createCodeNode = mod.$createCodeNode;
export const $isCodeHighlightNode = mod.$isCodeHighlightNode;
export const $isCodeNode = mod.$isCodeNode;
export const CODE_LANGUAGE_FRIENDLY_NAME_MAP = mod.CODE_LANGUAGE_FRIENDLY_NAME_MAP;
export const CODE_LANGUAGE_MAP = mod.CODE_LANGUAGE_MAP;
export const CodeHighlightNode = mod.CodeHighlightNode;
export const CodeNode = mod.CodeNode;
export const DEFAULT_CODE_LANGUAGE = mod.DEFAULT_CODE_LANGUAGE;
export const PrismTokenizer = mod.PrismTokenizer;
export const getCodeLanguages = mod.getCodeLanguages;
export const getDefaultCodeLanguage = mod.getDefaultCodeLanguage;
export const getEndOfCodeInLine = mod.getEndOfCodeInLine;
export const getFirstCodeNodeOfLine = mod.getFirstCodeNodeOfLine;
export const getLanguageFriendlyName = mod.getLanguageFriendlyName;
export const getLastCodeNodeOfLine = mod.getLastCodeNodeOfLine;
export const getStartOfCodeInLine = mod.getStartOfCodeInLine;
export const normalizeCodeLang = mod.normalizeCodeLang;
export const registerCodeHighlighting = mod.registerCodeHighlighting;