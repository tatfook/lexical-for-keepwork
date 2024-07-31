/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{$isTextNode as e,$isElementNode as t,$isParagraphNode as n,$getCharacterOffsets as o,$isRootNode as l,$getNodeByKey as r,$getPreviousSelection as s,$createTextNode as i,$isRangeSelection as c,$getRoot as f,$isRootOrShadowRoot as u,$hasAncestor as a,$isLeafNode as g,$setSelection as d,$getAdjacentNode as p,$isDecoratorNode as h,$isLineBreakNode as _}from"lexical";function m(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var y=m((function(e){const t=new URLSearchParams;t.append("code",e);for(let e=1;e<arguments.length;e++)t.append("v",arguments[e]);throw Error(`Minified Lexical error #${e}; visit https://lexical.dev/docs/error?${t} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));const T=new Map;function x(e){let t=e;for(;null!=t;){if(t.nodeType===Node.TEXT_NODE)return t;t=t.firstChild}return null}function S(e){const t=e.parentNode;if(null==t)throw new Error("Should never happen");return[t,Array.from(t.childNodes).indexOf(e)]}function v(t,n,o,l,r){const s=n.getKey(),i=l.getKey(),c=document.createRange();let f=t.getElementByKey(s),u=t.getElementByKey(i),a=o,g=r;if(e(n)&&(f=x(f)),e(l)&&(u=x(u)),void 0===n||void 0===l||null===f||null===u)return null;"BR"===f.nodeName&&([f,a]=S(f)),"BR"===u.nodeName&&([u,g]=S(u));const d=f.firstChild;f===u&&null!=d&&"BR"===d.nodeName&&0===a&&0===g&&(g=1);try{c.setStart(f,a),c.setEnd(u,g)}catch(e){return null}return!c.collapsed||a===g&&s===i||(c.setStart(u,g),c.setEnd(f,a)),c}function C(e,t){const n=e.getRootElement();if(null===n)return[];const o=n.getBoundingClientRect(),l=getComputedStyle(n),r=parseFloat(l.paddingLeft)+parseFloat(l.paddingRight),s=Array.from(t.getClientRects());let i,c=s.length;s.sort(((e,t)=>{const n=e.top-t.top;return Math.abs(n)<=3?e.left-t.left:n}));for(let e=0;e<c;e++){const t=s[e],n=i&&i.top<=t.top&&i.top+i.height>t.top&&i.left+i.width>t.left,l=t.width+r===o.width;n||l?(s.splice(e--,1),c--):i=t}return s}function w(e){const t={},n=e.split(";");for(const e of n)if(""!==e){const[n,o]=e.split(/:([^]+)/);n&&o&&(t[n.trim()]=o.trim())}return t}function N(e){let t=T.get(e);return void 0===t&&(t=w(e),T.set(e,t)),t}function P(o){const l=o.constructor.clone(o);return l.__parent=o.__parent,l.__next=o.__next,l.__prev=o.__prev,t(o)&&t(l)?(s=o,(r=l).__first=s.__first,r.__last=s.__last,r.__size=s.__size,r.__format=s.__format,r.__indent=s.__indent,r.__dir=s.__dir,r):e(o)&&e(l)?function(e,t){return e.__format=t.__format,e.__style=t.__style,e.__mode=t.__mode,e.__detail=t.__detail,e}(l,o):n(o)&&n(l)?function(e,t){return e.__textFormat=t.__textFormat,e}(l,o):l;var r,s}function E(e,t){const n=e.getStartEndPoints();if(t.isSelected(e)&&!t.isSegmented()&&!t.isToken()&&null!==n){const[l,r]=n,s=e.isBackward(),i=l.getNode(),c=r.getNode(),f=t.is(i),u=t.is(c);if(f||u){const[n,l]=o(e),r=i.is(c),f=t.is(s?c:i),u=t.is(s?i:c);let a,g=0;if(r)g=n>l?l:n,a=n>l?n:l;else if(f){g=s?l:n,a=void 0}else if(u){g=0,a=s?n:l}return t.__text=t.__text.slice(g,a),t}}return t}function F(e){if("text"===e.type)return e.offset===e.getNode().getTextContentSize();const n=e.getNode();return t(n)||y(177),e.offset===n.getChildrenSize()}function I(n,o,f){let u=o.getNode(),a=f;if(t(u)){const e=u.getDescendantByIndex(o.offset);null!==e&&(u=e)}for(;a>0&&null!==u;){if(t(u)){const e=u.getLastDescendant();null!==e&&(u=e)}let f=u.getPreviousSibling(),g=0;if(null===f){let e=u.getParentOrThrow(),t=e.getPreviousSibling();for(;null===t;){if(e=e.getParent(),null===e){f=null;break}t=e.getPreviousSibling()}null!==e&&(g=e.isInline()?0:2,f=t)}let d=u.getTextContent();""===d&&t(u)&&!u.isInline()&&(d="\n\n");const p=d.length;if(!e(u)||a>=p){const e=u.getParent();u.remove(),null==e||0!==e.getChildrenSize()||l(e)||e.remove(),a-=p+g,u=f}else{const t=u.getKey(),l=n.getEditorState().read((()=>{const n=r(t);return e(n)&&n.isSimpleText()?n.getTextContent():null})),f=p-a,g=d.slice(0,f);if(null!==l&&l!==d){const e=s();let t=u;if(u.isSimpleText())u.setTextContent(l);else{const e=i(l);u.replace(e),t=e}if(c(e)&&e.isCollapsed()){const n=e.anchor.offset;t.select(n,n)}}else if(u.isSimpleText()){const e=o.key===t;let n=o.offset;n<a&&(n=p);const l=e?n-a:0,r=e?n:f;if(e&&0===l){const[e]=u.splitText(l,r);e.remove()}else{const[,e]=u.splitText(l,r);e.remove()}}else{const e=i(g);u.replace(e)}a=0}}}function K(e){const t=e.getStyle(),n=w(t);T.set(t,n)}function O(e,t){const n=N("getStyle"in e?e.getStyle():e.style),o=Object.entries(t).reduce(((e,[t,o])=>(o instanceof Function?e[t]=o(n[t]):null===o?delete e[t]:e[t]=o,e)),{...n}||{}),l=function(e){let t="";for(const n in e)n&&(t+=`${n}: ${e[n]};`);return t}(o);e.setStyle(l),T.set(l,o)}function B(t,n){const o=t.getNodes(),l=o.length,r=t.getStartEndPoints();if(null===r)return;const[s,i]=r,f=l-1;let u=o[0],a=o[f];if(t.isCollapsed()&&c(t))return void O(t,n);const g=u.getTextContent().length,d=i.offset;let p=s.offset;const h=s.isBefore(i);let _=h?p:d,m=h?d:p;const y=h?s.type:i.type,T=h?i.type:s.type,x=h?i.key:s.key;if(e(u)&&_===g){const t=u.getNextSibling();e(t)&&(p=0,_=0,u=t)}if(1===o.length){if(e(u)&&u.canHaveFormat()){if(_="element"===y?0:p>d?d:p,m="element"===T?g:p>d?p:d,_===m)return;if(0===_&&m===g)O(u,n),u.select(_,m);else{const e=u.splitText(_,m),t=0===_?e[0]:e[1];O(t,n),t.select(0,m-_)}}}else{if(e(u)&&_<u.getTextContentSize()&&u.canHaveFormat()&&(0!==_&&(u=u.splitText(_)[1],_=0,s.set(u.getKey(),_,"text")),O(u,n)),e(a)&&a.canHaveFormat()){const e=a.getTextContent().length;a.__key!==x&&0!==m&&(m=e),m!==e&&([a]=a.splitText(m)),0===m&&"element"!==T||O(a,n)}for(let t=1;t<f;t++){const l=o[t],r=l.getKey();e(l)&&l.canHaveFormat()&&r!==u.getKey()&&r!==a.getKey()&&!l.isToken()&&O(l,n)}}}function k(e,n){if(null===e)return;const o=e.getStartEndPoints(),l=o?o[0]:null;if(null!==l&&"root"===l.key){const e=n(),t=f(),o=t.getFirstChild();return void(o?o.replace(e,!0):t.append(e))}const r=e.getNodes(),s=null!==l&&function(e,t){let n=e;for(;null!==n&&null!==n.getParent()&&!t(n);)n=n.getParentOrThrow();return t(n)?n:null}(l.getNode(),X);s&&-1===r.indexOf(s)&&r.push(s);for(let e=0;e<r.length;e++){const o=r[e];if(!X(o))continue;t(o)||y(178);const l=n();l.setFormat(o.getFormatType()),l.setIndent(o.getIndent()),o.replace(l,!0)}}function b(e){return e.getNode().isAttached()}function z(e){let t=e;for(;null!==t&&!u(t);){const e=t.getLatest(),n=t.getParent();0===e.getChildrenSize()&&t.remove(!0),t=n}}function R(e,t,n=null){const o=e.getStartEndPoints(),l=o?o[0]:null,r=e.getNodes(),s=r.length;if(null!==l&&(0===s||1===s&&"element"===l.type&&0===l.getNode().getChildrenSize())){const e="text"===l.type?l.getNode().getParentOrThrow():l.getNode(),o=e.getChildren();let r=t();return r.setFormat(e.getFormatType()),r.setIndent(e.getIndent()),o.forEach((e=>r.append(e))),n&&(r=n.append(r)),void e.replace(r)}let i=null,c=[];for(let o=0;o<s;o++){const l=r[o];u(l)?(A(e,c,c.length,t,n),c=[],i=l):null===i||null!==i&&a(l,i)?c.push(l):(A(e,c,c.length,t,n),c=[l])}A(e,c,c.length,t,n)}function A(e,n,o,l,r=null){if(0===n.length)return;const i=n[0],f=new Map,a=[];let p=t(i)?i:i.getParentOrThrow();p.isInline()&&(p=p.getParentOrThrow());let h=!1;for(;null!==p;){const e=p.getPreviousSibling();if(null!==e){p=e,h=!0;break}if(p=p.getParentOrThrow(),u(p))break}const _=new Set;for(let e=0;e<o;e++){const o=n[e];t(o)&&0===o.getChildrenSize()&&_.add(o.getKey())}const m=new Set;for(let e=0;e<o;e++){const o=n[e];let r=o.getParent();if(null!==r&&r.isInline()&&(r=r.getParent()),null!==r&&g(o)&&!m.has(o.getKey())){const e=r.getKey();if(void 0===f.get(e)){const n=l();n.setFormat(r.getFormatType()),n.setIndent(r.getIndent()),a.push(n),f.set(e,n),r.getChildren().forEach((e=>{n.append(e),m.add(e.getKey()),t(e)&&e.getChildrenKeys().forEach((e=>m.add(e)))})),z(r)}}else if(_.has(o.getKey())){t(o)||y(179);const e=l();e.setFormat(o.getFormatType()),e.setIndent(o.getIndent()),a.push(e),o.remove(!0)}}if(null!==r)for(let e=0;e<a.length;e++){const t=a[e];r.append(t)}let T=null;if(u(p))if(h)if(null!==r)p.insertAfter(r);else for(let e=a.length-1;e>=0;e--){const t=a[e];p.insertAfter(t)}else{const e=p.getFirstChild();if(t(e)&&(p=e),null===e)if(r)p.append(r);else for(let e=0;e<a.length;e++){const t=a[e];p.append(t),T=t}else if(null!==r)e.insertBefore(r);else for(let t=0;t<a.length;t++){const n=a[t];e.insertBefore(n),T=n}}else if(r)p.insertAfter(r);else for(let e=a.length-1;e>=0;e--){const t=a[e];p.insertAfter(t),T=t}const x=s();c(x)&&b(x.anchor)&&b(x.focus)?d(x.clone()):null!==T?T.selectEnd():e.dirty=!0}function L(e,n){const o=p(e.focus,n);return h(o)&&!o.isIsolated()||t(o)&&!o.isInline()&&!o.canBeEmpty()}function D(e,t,n,o){e.modify(t?"extend":"move",n,o)}function M(e){const t=e.anchor.getNode();return"rtl"===(l(t)?t:t.getParentOrThrow()).getDirection()}function H(e,t,n){const o=M(e);D(e,t,n?!o:o,"character")}function $(n){const o=n.anchor,l=n.focus,r=o.getNode().getTopLevelElementOrThrow().getParentOrThrow();let s=r.getFirstDescendant(),i=r.getLastDescendant(),c="element",f="element",u=0;e(s)?c="text":t(s)||null===s||(s=s.getParentOrThrow()),e(i)?(f="text",u=i.getTextContentSize()):t(i)||null===i||(i=i.getParentOrThrow()),s&&i&&(o.set(s.getKey(),0,c),l.set(i.getKey(),u,f))}function j(e,t,n){const o=N(e.getStyle());return null!==o&&o[t]||n}function U(t,n,o=""){let l=null;const r=t.getNodes(),s=t.anchor,i=t.focus,f=t.isBackward(),u=f?i.offset:s.offset,a=f?i.getNode():s.getNode();if(c(t)&&t.isCollapsed()&&""!==t.style){const e=N(t.style);if(null!==e&&n in e)return e[n]}for(let t=0;t<r.length;t++){const s=r[t];if((0===t||0!==u||!s.is(a))&&e(s)){const e=j(s,n,o);if(null===l)l=e;else if(l!==e){l="";break}}}return null===l?o:l}function X(n){if(h(n))return!1;if(!t(n)||u(n))return!1;const o=n.getFirstChild(),l=null===o||_(o)||e(o)||o.isInline();return!n.isInline()&&!1!==n.canBeEmpty()&&l}const q=I;export{K as $addNodeStyle,P as $cloneWithProperties,U as $getSelectionStyleValueForProperty,F as $isAtNodeEnd,M as $isParentElementRTL,D as $moveCaretSelection,H as $moveCharacter,B as $patchStyleText,$ as $selectAll,k as $setBlocksType,L as $shouldOverrideDefaultCharacterSelection,E as $sliceSelectedTextNodeContent,I as $trimTextContentFromAnchor,R as $wrapNodes,v as createDOMRange,C as createRectsFromDOMRange,N as getStyleObjectFromCSS,q as trimTextContentFromAnchor};
