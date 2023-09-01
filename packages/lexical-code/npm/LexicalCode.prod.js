/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';var d=require("prismjs");require("prismjs/components/prism-clike");require("prismjs/components/prism-javascript");require("prismjs/components/prism-markup");require("prismjs/components/prism-markdown");require("prismjs/components/prism-c");require("prismjs/components/prism-css");require("prismjs/components/prism-objectivec");require("prismjs/components/prism-sql");require("prismjs/components/prism-python");require("prismjs/components/prism-rust");require("prismjs/components/prism-swift");
require("prismjs/components/prism-typescript");require("prismjs/components/prism-java");require("prismjs/components/prism-cpp");var l=require("@lexical/utils"),r=require("lexical");let v=a=>null!=a&&d.languages.hasOwnProperty(a)?a:void 0;function x(a,b){for(let c of a.childNodes){if(l.isHTMLElement(c)&&c.tagName===b)return!0;x(c,b)}return!1}
class y extends r.ElementNode{static getType(){return"code"}static clone(a){return new y(a.__language,a.__key)}constructor(a,b){super(b);this.__language=v(a)}createDOM(a){let b=document.createElement("code");l.addClassNamesToElement(b,a.theme.code);b.setAttribute("spellcheck","false");(a=this.getLanguage())&&b.setAttribute("data-highlight-language",a);return b}updateDOM(a,b){let c=this.__language;a=a.__language;c?c!==a&&b.setAttribute("data-highlight-language",c):a&&b.removeAttribute("data-highlight-language");
return!1}exportDOM(){let a=document.createElement("pre");a.setAttribute("spellcheck","false");let b=this.getLanguage();b&&a.setAttribute("data-highlight-language",b);return{element:a}}static importDOM(){return{code:a=>null!=a.textContent&&(/\r?\n/.test(a.textContent)||x(a,"BR"))?{conversion:z,priority:1}:null,div:()=>({conversion:aa,priority:1}),pre:()=>({conversion:z,priority:0}),table:a=>A(a)?{conversion:ba,priority:3}:null,td:a=>{let b=a.closest("table");return a.classList.contains("js-file-line")?
{conversion:ca,priority:3}:b&&A(b)?{conversion:B,priority:3}:null},tr:a=>(a=a.closest("table"))&&A(a)?{conversion:B,priority:3}:null}}static importJSON(a){let b=C(a.language);b.setFormat(a.format);b.setIndent(a.indent);b.setDirection(a.direction);return b}exportJSON(){return{...super.exportJSON(),language:this.getLanguage(),type:"code",version:1}}insertNewAfter(a,b=!0){var c=this.getChildren(),e=c.length;if(2<=e&&"\n"===c[e-1].getTextContent()&&"\n"===c[e-2].getTextContent()&&a.isCollapsed()&&a.anchor.key===
this.__key&&a.anchor.offset===e)return c[e-1].remove(),c[e-2].remove(),a=r.$createParagraphNode(),this.insertAfter(a,b),a;b=a.anchor;c=a.focus;b=(b.isBefore(c)?b:c).getNode();if(D(b)||r.$isTabNode(b)){b=E(b);for(c=[];;)if(r.$isTabNode(b))c.push(r.$createTabNode()),b=b.getNextSibling();else if(D(b)){e=0;let f=b.getTextContent(),g=b.getTextContentSize();for(;e<g&&" "===f[e];e++);0!==e&&c.push(F(" ".repeat(e)));if(e!==g)break;b=b.getNextSibling()}else break;if(0<c.length)return a.insertNodes([r.$createLineBreakNode(),
...c]),c[c.length-1]}return null}canIndent(){return!1}collapseAtStart(){let a=r.$createParagraphNode();this.getChildren().forEach(b=>a.append(b));this.replace(a);return!0}setLanguage(a){this.getWritable().__language=v(a)}getLanguage(){return this.getLatest().__language}}function C(a){return r.$applyNodeReplacement(new y(a))}function G(a){return a instanceof y}function z(a){let b;l.isHTMLElement(a)&&(b=a.getAttribute("data-highlight-language"));return{node:C(b)}}
function aa(a){let b=null!==a.style.fontFamily.match("monospace");return b||da(a)?{after:c=>{let e=a.parentNode;null!=e&&a!==e.lastChild&&c.push(r.$createLineBreakNode());return c},node:b?C():null}:{node:null}}function ba(){return{node:C()}}function B(){return{node:null}}function ca(a){return{after:b=>{a.parentNode&&a.parentNode.nextSibling&&b.push(r.$createLineBreakNode());return b},node:null}}
function da(a){for(a=a.parentElement;null!==a;){if(null!==a.style.fontFamily.match("monospace"))return!0;a=a.parentElement}return!1}function A(a){return a.classList.contains("js-file-line-container")}
let H={c:"C",clike:"C-like",cpp:"C++",css:"CSS",html:"HTML",java:"Java",js:"JavaScript",markdown:"Markdown",objc:"Objective-C",plain:"Plain Text",py:"Python",rust:"Rust",sql:"SQL",swift:"Swift",typescript:"TypeScript",xml:"XML"},I={cpp:"cpp",java:"java",javascript:"js",md:"markdown",plaintext:"plain",python:"py",text:"plain",ts:"typescript"};function K(a){return I[a]||a}
class L extends r.TextNode{constructor(a,b,c){super(a,c);this.__highlightType=b}static getType(){return"code-highlight"}static clone(a){return new L(a.__text,a.__highlightType||void 0,a.__key)}getHighlightType(){return this.getLatest().__highlightType}createDOM(a){let b=super.createDOM(a);a=M(a.theme,this.__highlightType);l.addClassNamesToElement(b,a);return b}updateDOM(a,b,c){let e=super.updateDOM(a,b,c);a=M(c.theme,a.__highlightType);c=M(c.theme,this.__highlightType);a!==c&&(a&&l.removeClassNamesFromElement(b,
a),c&&l.addClassNamesToElement(b,c));return e}static importJSON(a){let b=F(a.text,a.highlightType);b.setFormat(a.format);b.setDetail(a.detail);b.setMode(a.mode);b.setStyle(a.style);return b}exportJSON(){return{...super.exportJSON(),highlightType:this.getHighlightType(),type:"code-highlight",version:1}}setFormat(){return this}isParentRequired(){return!0}createParentElementNode(){return C()}}function M(a,b){return b&&a&&a.codeHighlight&&a.codeHighlight[b]}
function F(a,b){return r.$applyNodeReplacement(new L(a,b))}function D(a){return a instanceof L}function E(a){let b=a;for(;D(a)||r.$isTabNode(a);)b=a,a=a.getPreviousSibling();return b}function N(a){let b=a;for(;D(a)||r.$isTabNode(a);)b=a,a=a.getNextSibling();return b}let O={defaultLanguage:"javascript",tokenize(a,b){return d.tokenize(a,d.languages[b||""]||d.languages[this.defaultLanguage])}};
function P(a,b){let c=null;var e=null,f=a;let g=b,h=a.getTextContent();for(;;){if(0===g){f=f.getPreviousSibling();if(null===f)break;if(!(D(f)||r.$isTabNode(f)||r.$isLineBreakNode(f)))throw Error("Expected a valid Code Node: CodeHighlightNode, TabNode, LineBreakNode");if(r.$isLineBreakNode(f)){c={node:f,offset:1};break}g=Math.max(0,f.getTextContentSize()-1);h=f.getTextContent()}else g--;let k=h[g];D(f)&&" "!==k&&(e={node:f,offset:g})}if(null!==e)return e;e=null;b<a.getTextContentSize()?D(a)&&(e=a.getTextContent()[b]):
(f=a.getNextSibling(),D(f)&&(e=f.getTextContent()[0]));if(null!==e&&" "!==e)return c;a:for(e=a,f=a.getTextContent(),a=a.getTextContentSize();;){if(!D(e)||b===a){e=e.getNextSibling();if(null===e||r.$isLineBreakNode(e)){a=null;break a}D(e)&&(b=0,f=e.getTextContent(),a=e.getTextContentSize())}if(D(e)){if(" "!==f[b]){a={node:e,offset:b};break a}b++}}return null!==a?a:c}function Q(a){a=N(a);if(r.$isLineBreakNode(a))throw Error("Unexpected lineBreakNode in getEndOfCodeInLine");return a}
function R(a,b,c){let e=a.getParent();G(e)?S(e,b,c):D(a)&&a.replace(r.$createTextNode(a.__text))}let T=new Set;
function S(a,b,c){let e=a.getKey();T.has(e)||(T.add(e),void 0===a.getLanguage()&&a.setLanguage(c.defaultLanguage),b.update(()=>{ea(e,()=>{var f=r.$getNodeByKey(e);if(!G(f)||!f.isAttached())return!1;var g=f.getTextContent();g=c.tokenize(g,f.getLanguage()||c.defaultLanguage);g=U(g);var h=f.getChildren();for(f=0;f<h.length&&V(h[f],g[f]);)f++;var k=h.length;let m=g.length,q=Math.min(k,m)-f,n=0;for(;n<q;)if(n++,!V(h[k-n],g[m-n])){n--;break}h=f;k-=n;g=g.slice(f,m-n);let {from:p,to:w,nodesForReplacement:u}=
{from:h,nodesForReplacement:g,to:k};return p!==w||u.length?(a.splice(p,w-p,u),!0):!1})},{onUpdate:()=>{T.delete(e)},skipTransforms:!0}))}
function U(a,b){let c=[];for(let e of a)if("string"===typeof e){a=e.split(/(\n|\t)/);let f=a.length;for(let g=0;g<f;g++){let h=a[g];"\n"===h||"\r\n"===h?c.push(r.$createLineBreakNode()):"\t"===h?c.push(r.$createTabNode()):0<h.length&&c.push(F(h,b))}}else({content:a}=e),"string"===typeof a?c.push(...U([a],e.type)):Array.isArray(a)&&c.push(...U(a,e.type));return c}
function ea(a,b){a=r.$getNodeByKey(a);if(G(a)&&a.isAttached()){var c=r.$getSelection();if(r.$isRangeSelection(c)){c=c.anchor;var e=c.offset,f="element"===c.type&&r.$isLineBreakNode(a.getChildAtIndex(c.offset-1)),g=0;if(!f){let h=c.getNode();g=e+h.getPreviousSiblings().reduce((k,m)=>k+m.getTextContentSize(),0)}b()&&(f?c.getNode().select(e,e):a.getChildren().some(h=>{let k=r.$isTextNode(h);if(k||r.$isLineBreakNode(h)){let m=h.getTextContentSize();if(k&&m>=g)return h.select(g,g),!0;g-=m}return!1}))}else b()}}
function V(a,b){return D(a)&&D(b)&&a.__text===b.__text&&a.__highlightType===b.__highlightType||r.$isTabNode(a)&&r.$isTabNode(b)||r.$isLineBreakNode(a)&&r.$isLineBreakNode(b)}function W(a){if(!r.$isRangeSelection(a))return!1;var b=a.anchor.getNode();a=a.focus.getNode();if(b.is(a)&&G(b))return!0;b=b.getParent();return G(b)&&b.is(a.getParent())}
function X(a){a=a.getNodes();let b=[[]];if(1===a.length&&G(a[0]))return b;let c=b[0];for(let e=0;e<a.length;e++){let f=a[e];if(!(D(f)||r.$isTabNode(f)||r.$isLineBreakNode(f)))throw Error("Expected selection to be inside CodeBlock and consisting of CodeHighlightNode, TabNode and LineBreakNode");r.$isLineBreakNode(f)?0!==e&&0<c.length&&(c=[],b.push(c)):c.push(f)}return b}
function fa(a){var b=r.$getSelection();if(!r.$isRangeSelection(b)||!W(b))return null;let c=a?r.OUTDENT_CONTENT_COMMAND:r.INDENT_CONTENT_COMMAND;a=a?r.OUTDENT_CONTENT_COMMAND:r.INSERT_TAB_COMMAND;if(1<X(b).length)return c;var e=b.getNodes()[0];if(!(G(e)||D(e)||r.$isTabNode(e)||r.$isLineBreakNode(e)))throw Error("Expected selection firstNode to be CodeHighlightNode or TabNode");if(G(e))return c;let f=E(e);e=N(e);var g=b.anchor;let h=b.focus;h.isBefore(g)?b=h:(b=g,g=h);return null!==f&&null!==e&&b.key===
f.getKey()&&0===b.offset&&g.key===e.getKey()&&g.offset===e.getTextContentSize()?c:a}
function Y(a){var b=r.$getSelection();if(!r.$isRangeSelection(b)||!W(b))return!1;var c=X(b);let e=c.length;if(1<c.length){for(b=0;b<e;b++){var f=c[b];0<f.length&&(f=f[0],0===b&&(f=E(f)),null!==f&&(a===r.INDENT_CONTENT_COMMAND?f.insertBefore(r.$createTabNode()):r.$isTabNode(f)&&f.remove()))}return!0}c=b.getNodes()[0];if(!(G(c)||D(c)||r.$isTabNode(c)||r.$isLineBreakNode(c)))throw Error("Expected selection firstNode to be CodeHighlightNode or CodeTabNode");if(G(c))return a===r.INDENT_CONTENT_COMMAND&&
b.insertNodes([r.$createTabNode()]),!0;c=E(c);if(null===c)throw Error("Expected getFirstCodeNodeOfLine to return a valid Code Node");a===r.INDENT_CONTENT_COMMAND?r.$isLineBreakNode(c)?c.insertAfter(r.$createTabNode()):c.insertBefore(r.$createTabNode()):r.$isTabNode(c)&&c.remove();return!0}
function Z(a,b){let c=r.$getSelection();if(!r.$isRangeSelection(c))return!1;let {anchor:e,focus:f}=c,g=e.offset,h=f.offset,k=e.getNode(),m=f.getNode();var q=a===r.KEY_ARROW_UP_COMMAND;if(!W(c)||!D(k)&&!r.$isTabNode(k)||!D(m)&&!r.$isTabNode(m))return!1;if(!b.altKey){if(c.isCollapsed())if(a=k.getParentOrThrow(),q&&0===g&&null===k.getPreviousSibling()){if(null===a.getPreviousSibling())return a.selectPrevious(),b.preventDefault(),!0}else if(!q&&g===k.getTextContentSize()&&null===k.getNextSibling()&&null===
a.getNextSibling())return a.selectNext(),b.preventDefault(),!0;return!1}let n;if(k.isBefore(m)){var p=E(k);n=N(m)}else p=E(m),n=N(k);if(null==p||null==n)return!1;let w=p.getNodesBetween(n);for(let t=0;t<w.length;t++){let J=w[t];if(!D(J)&&!r.$isTabNode(J)&&!r.$isLineBreakNode(J))return!1}b.preventDefault();b.stopPropagation();b=q?p.getPreviousSibling():n.getNextSibling();if(!r.$isLineBreakNode(b))return!0;p=q?b.getPreviousSibling():b.getNextSibling();if(null==p)return!0;q=D(p)||r.$isTabNode(p)||r.$isLineBreakNode(p)?
q?E(p):N(p):null;let u=null!=q?q:p;b.remove();w.forEach(t=>t.remove());a===r.KEY_ARROW_UP_COMMAND?(w.forEach(t=>u.insertBefore(t)),u.insertBefore(b)):(u.insertAfter(b),u=b,w.forEach(t=>{u.insertAfter(t);u=t}));c.setTextNodeRange(k,g,m,h);return!0}
function ha(a,b){let c=r.$getSelection();if(!r.$isRangeSelection(c))return!1;let {anchor:e,focus:f}=c;var g=e.getNode();let h=f.getNode();a=a===r.MOVE_TO_START;if(!D(g)&&!r.$isTabNode(g)||!D(h)&&!r.$isTabNode(h))return!1;if(a)if(g=P(h,f.offset),null!==g){let {node:k,offset:m}=g;r.$isLineBreakNode(k)?k.selectNext(0,0):c.setTextNodeRange(k,m,k,m)}else h.getParentOrThrow().selectStart();else Q(h).select();b.preventDefault();b.stopPropagation();return!0}exports.$createCodeHighlightNode=F;
exports.$createCodeNode=C;exports.$isCodeHighlightNode=D;exports.$isCodeNode=G;exports.CODE_LANGUAGE_FRIENDLY_NAME_MAP=H;exports.CODE_LANGUAGE_MAP=I;exports.CodeHighlightNode=L;exports.CodeNode=y;exports.DEFAULT_CODE_LANGUAGE="javascript";exports.PrismTokenizer=O;exports.getCodeLanguages=()=>Object.keys(d.languages).filter(a=>"function"!==typeof d.languages[a]).sort();exports.getDefaultCodeLanguage=()=>"javascript";exports.getEndOfCodeInLine=Q;exports.getFirstCodeNodeOfLine=E;
exports.getLanguageFriendlyName=function(a){a=K(a);return H[a]||a};exports.getLastCodeNodeOfLine=N;exports.getStartOfCodeInLine=P;exports.normalizeCodeLang=K;
exports.registerCodeHighlighting=function(a,b){if(!a.hasNodes([y,L]))throw Error("CodeHighlightPlugin: CodeNode or CodeHighlightNode not registered on editor");null==b&&(b=O);return l.mergeRegister(a.registerMutationListener(y,c=>{a.update(()=>{for(let [g,h]of c)if("destroyed"!==h){var e=r.$getNodeByKey(g);if(null!==e)a:{var f=e;e=a.getElementByKey(f.getKey());if(null===e)break a;f=f.getChildren();let k=f.length;if(k===e.__cachedChildrenLength)break a;e.__cachedChildrenLength=k;let m="1",q=1;for(let n=
0;n<k;n++)r.$isLineBreakNode(f[n])&&(m+="\n"+ ++q);e.setAttribute("data-gutter",m)}}})}),a.registerNodeTransform(y,c=>S(c,a,b)),a.registerNodeTransform(r.TextNode,c=>R(c,a,b)),a.registerNodeTransform(L,c=>R(c,a,b)),a.registerCommand(r.KEY_TAB_COMMAND,c=>{let e=fa(c.shiftKey);if(null===e)return!1;c.preventDefault();a.dispatchCommand(e,void 0);return!0},r.COMMAND_PRIORITY_LOW),a.registerCommand(r.INSERT_TAB_COMMAND,()=>{let c=r.$getSelection();if(!W(c))return!1;r.$insertNodes([r.$createTabNode()]);
return!0},r.COMMAND_PRIORITY_LOW),a.registerCommand(r.INDENT_CONTENT_COMMAND,()=>Y(r.INDENT_CONTENT_COMMAND),r.COMMAND_PRIORITY_LOW),a.registerCommand(r.OUTDENT_CONTENT_COMMAND,()=>Y(r.OUTDENT_CONTENT_COMMAND),r.COMMAND_PRIORITY_LOW),a.registerCommand(r.KEY_ARROW_UP_COMMAND,c=>Z(r.KEY_ARROW_UP_COMMAND,c),r.COMMAND_PRIORITY_LOW),a.registerCommand(r.KEY_ARROW_DOWN_COMMAND,c=>Z(r.KEY_ARROW_DOWN_COMMAND,c),r.COMMAND_PRIORITY_LOW),a.registerCommand(r.MOVE_TO_END,c=>ha(r.MOVE_TO_END,c),r.COMMAND_PRIORITY_LOW),
a.registerCommand(r.MOVE_TO_START,c=>ha(r.MOVE_TO_START,c),r.COMMAND_PRIORITY_LOW))}
