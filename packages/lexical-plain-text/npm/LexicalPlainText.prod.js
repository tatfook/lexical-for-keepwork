/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var a=require("@lexical/clipboard"),f=require("@lexical/selection"),g=require("@lexical/utils"),h=require("lexical");
let k="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement,l=k&&"documentMode"in document?document.documentMode:null,n=k&&"InputEvent"in window&&!l?"getTargetRanges"in new window.InputEvent("input"):!1,p=k&&/Version\/[\d.]+.*Safari/.test(navigator.userAgent),q=k&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,r=k&&/^(?=.*Chrome).*/i.test(navigator.userAgent),t=k&&/AppleWebKit\/[\d.]+/.test(navigator.userAgent)&&!r;
function u(d,b){b.update(()=>{if(null!==d){let c=g.objectKlassEquals(d,KeyboardEvent)?null:d.clipboardData,e=h.$getSelection();if(null!==e&&null!=c){d.preventDefault();let m=a.$getHtmlContent(b);null!==m&&c.setData("text/html",m);c.setData("text/plain",e.getTextContent())}}})}function v(d,b){d.preventDefault();b.update(()=>{let c=h.$getSelection(),{clipboardData:e}=d;null!=e&&h.$isRangeSelection(c)&&a.$insertDataTransferForPlainText(e,c)},{tag:"paste"})}
function w(d,b){u(d,b);b.update(()=>{let c=h.$getSelection();h.$isRangeSelection(c)&&c.removeText()})}
exports.registerPlainText=function(d){return g.mergeRegister(d.registerCommand(h.DELETE_CHARACTER_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;c.deleteCharacter(b);return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.DELETE_WORD_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;c.deleteWord(b);return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.DELETE_LINE_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;c.deleteLine(b);
return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.CONTROLLED_TEXT_INSERTION_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;if("string"===typeof b)c.insertText(b);else{const e=b.dataTransfer;null!=e?a.$insertDataTransferForPlainText(e,c):(b=b.data)&&c.insertText(b)}return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.REMOVE_TEXT_COMMAND,()=>{const b=h.$getSelection();if(!h.$isRangeSelection(b))return!1;b.removeText();return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.INSERT_LINE_BREAK_COMMAND,
b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;c.insertLineBreak(b);return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.INSERT_PARAGRAPH_COMMAND,()=>{const b=h.$getSelection();if(!h.$isRangeSelection(b))return!1;b.insertLineBreak();return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.KEY_ARROW_LEFT_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;const e=b.shiftKey;return f.$shouldOverrideDefaultCharacterSelection(c,!0)?(b.preventDefault(),f.$moveCharacter(c,
e,!0),!0):!1},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.KEY_ARROW_RIGHT_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;const e=b.shiftKey;return f.$shouldOverrideDefaultCharacterSelection(c,!1)?(b.preventDefault(),f.$moveCharacter(c,e,!1),!0):!1},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.KEY_BACKSPACE_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;b.preventDefault();return d.dispatchCommand(h.DELETE_CHARACTER_COMMAND,!0)},h.COMMAND_PRIORITY_EDITOR),
d.registerCommand(h.KEY_DELETE_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;b.preventDefault();return d.dispatchCommand(h.DELETE_CHARACTER_COMMAND,!1)},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.KEY_ENTER_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;if(null!==b){if((q||p||t)&&n)return!1;b.preventDefault()}return d.dispatchCommand(h.INSERT_LINE_BREAK_COMMAND,!1)},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.KEY_ESCAPE_COMMAND,()=>{const b=
h.$getSelection();if(!h.$isRangeSelection(b))return!1;d.blur();return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.SELECT_ALL_COMMAND,()=>{h.$selectAll();return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.COPY_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;u(b,d);return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.CUT_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;w(b,d);return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.PASTE_COMMAND,
b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;v(b,d);return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.DROP_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;b.preventDefault();return!0},h.COMMAND_PRIORITY_EDITOR),d.registerCommand(h.DRAGSTART_COMMAND,b=>{const c=h.$getSelection();if(!h.$isRangeSelection(c))return!1;b.preventDefault();return!0},h.COMMAND_PRIORITY_EDITOR))}
