/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';var f=require("@lexical/html"),m=require("@lexical/selection"),n=require("@lexical/utils"),p=require("lexical"),t;function u(a){let b=new URLSearchParams;b.append("code",a);for(let c=1;c<arguments.length;c++)b.append("v",arguments[c]);throw Error(`Minified Lexical error #${a}; visit https://lexical.dev/docs/error?${b} for the full message or `+"use the non-minified dev environment for full errors and additional helpful warnings.");}
t=u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u["default"]:u;let v="undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.createElement;function w(a){let b=p.$getSelection();null==b&&t(166);return p.$isRangeSelection(b)&&b.isCollapsed()||0===b.getNodes().length?"":f.$generateHtmlFromNodes(a,b)}
function x(a){let b=p.$getSelection();null==b&&t(166);return p.$isRangeSelection(b)&&b.isCollapsed()||0===b.getNodes().length?null:JSON.stringify(y(a,b))}function z(a,b,c){a.dispatchCommand(p.SELECTION_INSERT_CLIPBOARD_NODES_COMMAND,{nodes:b,selection:c})||c.insertNodes(b)}
function A(a,b,c,d=[]){let e=null!==b?c.isSelected(b):!0,h=p.$isElementNode(c)&&c.excludeFromCopy("html");var g=c;if(null!==b){var k=m.$cloneWithProperties(c);g=k=p.$isTextNode(k)&&null!==b?m.$sliceSelectedTextNodeContent(b,k):k}let q=p.$isElementNode(g)?g.getChildren():[];var l=g;k=l.exportJSON();var r=l.constructor;k.type!==r.getType()&&t(58,r.name);p.$isElementNode(l)&&(Array.isArray(k.children)||t(59,r.name));p.$isTextNode(g)&&(g=g.__text,0<g.length?k.text=g:e=!1);for(g=0;g<q.length;g++)l=q[g],
r=A(a,b,l,k.children),!e&&p.$isElementNode(c)&&r&&c.extractWithChild(l,b,"clone")&&(e=!0);if(e&&!h)d.push(k);else if(Array.isArray(k.children))for(a=0;a<k.children.length;a++)d.push(k.children[a]);return e}function y(a,b){let c=[],d=p.$getRoot().getChildren();for(let e=0;e<d.length;e++)A(a,b,d[e],c);return{namespace:a._config.namespace,nodes:c}}function B(a){let b=[];for(let c=0;c<a.length;c++){let d=p.$parseSerializedNode(a[c]);p.$isTextNode(d)&&m.$addNodeStyle(d);b.push(d)}return b}let C=null;
function D(a,b){var c=v?(a._window||window).getSelection():null;if(!c)return!1;var d=c.anchorNode;c=c.focusNode;if(null!==d&&null!==c&&!p.isSelectionWithinEditor(a,d,c))return!1;b.preventDefault();b=b.clipboardData;d=p.$getSelection();if(null===b||null===d)return!1;c=w(a);a=x(a);let e="";null!==d&&(e=d.getTextContent());null!==c&&b.setData("text/html",c);null!==a&&b.setData("application/x-lexical-editor",a);b.setData("text/plain",e);return!0}exports.$generateJSONFromSelectedNodes=y;
exports.$generateNodesFromSerializedNodes=B;exports.$getHtmlContent=w;exports.$getLexicalContent=x;exports.$insertDataTransferForPlainText=function(a,b){a=a.getData("text/plain")||a.getData("text/uri-list");null!=a&&b.insertRawText(a)};
exports.$insertDataTransferForRichText=function(a,b,c){var d=a.getData("application/x-lexical-editor");if(d)try{let h=JSON.parse(d);if(h.namespace===c._config.namespace&&Array.isArray(h.nodes)){let g=B(h.nodes);return z(c,g,b)}}catch(h){}if(d=a.getData("text/html"))try{var e=(new DOMParser).parseFromString(d,"text/html");let h=f.$generateNodesFromDOM(c,e);return z(c,h,b)}catch(h){}a=a.getData("text/plain")||a.getData("text/uri-list");if(null!=a)if(p.$isRangeSelection(b))for(b=a.split(/(\r?\n|\t)/),
""===b[b.length-1]&&b.pop(),a=0;a<b.length;a++)c=p.$getSelection(),p.$isRangeSelection(c)&&(e=b[a],"\n"===e||"\r\n"===e?c.insertParagraph():"\t"===e?c.insertNodes([p.$createTabNode()]):c.insertText(e));else b.insertRawText(a)};exports.$insertGeneratedNodes=z;
exports.copyToClipboard=async function(a,b){if(null!==C)return!1;if(null!==b)return new Promise(g=>{a.update(()=>{g(D(a,b))})});var c=a.getRootElement();let d=null==a._window?window.document:a._window.document,e=v?(a._window||window).getSelection():null;if(null===c||null===e)return!1;let h=d.createElement("span");h.style.cssText="position: fixed; top: -1000px;";h.append(d.createTextNode("#"));c.append(h);c=new Range;c.setStart(h,0);c.setEnd(h,1);e.removeAllRanges();e.addRange(c);return new Promise(g=>
{let k=a.registerCommand(p.COPY_COMMAND,q=>{n.objectKlassEquals(q,ClipboardEvent)&&(k(),null!==C&&(window.clearTimeout(C),C=null),g(D(a,q)));return!0},p.COMMAND_PRIORITY_CRITICAL);C=window.setTimeout(()=>{k();C=null;g(!1)},50);d.execCommand("copy");h.remove()})}
