/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{AutoLinkNode as t,$isAutoLinkNode as e,$isLinkNode as n,$createAutoLinkNode as l}from"@lexical/link";import{useLexicalComposerContext as r}from"@lexical/react/LexicalComposerContext";import{mergeRegister as o}from"@lexical/utils";import{TextNode as i,$isTextNode as s,$isElementNode as u,$isLineBreakNode as g,$createTextNode as c,$getSelection as f,$isRangeSelection as a,$isNodeSelection as h}from"lexical";import{useEffect as p}from"react";function x(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var d=x((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function m(t,e=(t=>t)){return n=>{const l=t.exec(n);return null===l?null:{index:l.index,length:l[0].length,text:l[0],url:e(l[0])}}}function T(t,e){for(let n=0;n<e.length;n++){const l=e[n](t);if(l)return l}return null}const b=/[.,;\s]/;function C(t){return b.test(t)}function S(t){return C(t[t.length-1])}function v(t){return C(t[0])}function L(t){let e=t.getPreviousSibling();return u(e)&&(e=e.getLastDescendant()),null===e||g(e)||s(e)&&S(e.getTextContent())}function R(t){let e=t.getNextSibling();return u(e)&&(e=e.getFirstDescendant()),null===e||g(e)||s(e)&&v(e.getTextContent())}function U(t,e,n,l){if(!(t>0?C(n[t-1]):L(l[0])))return!1;return e<n.length?C(n[e]):R(l[l.length-1])}function N(t,e,n){const l=[],r=[],o=[];let i=0,s=0;const u=[...t];for(;u.length>0;){const t=u[0],g=t.getTextContent().length,c=s;s+g<=e?(l.push(t),i+=g):c>=n?o.push(t):r.push(t),s+=g,u.shift()}return[i,l,r,o]}function y(t,e,n,r){const o=l(r.url,r.attributes);if(1===t.length){let l,i=t[0];0===e?[l,i]=i.splitText(n):[,l,i]=i.splitText(e,n);const s=c(r.text);return s.setFormat(l.getFormat()),s.setDetail(l.getDetail()),s.setStyle(l.getStyle()),o.append(s),l.replace(o),i}if(t.length>1){const l=t[0];let r,i=l.getTextContent().length;0===e?r=l:[,r]=l.splitText(e);const u=[];let g;for(let e=1;e<t.length;e++){const l=t[e],r=l.getTextContent().length,o=i;if(o<n)if(i+r<=n)u.push(l);else{const[t,e]=l.splitText(n-o);u.push(t),g=e}i+=r}const p=f(),x=p?p.getNodes().find(s):void 0,d=c(r.getTextContent());return d.setFormat(r.getFormat()),d.setDetail(r.getDetail()),d.setStyle(r.getStyle()),o.append(d,...u),x&&x===r&&(a(p)?d.select(p.anchor.offset,p.focus.offset):h(p)&&d.select(0,d.getTextContent().length)),r.replace(o),g}}function D(t,e,n){const l=t.getChildren(),r=l.length;for(let e=0;e<r;e++){const r=l[e];if(!s(r)||!r.isSimpleText())return P(t),void n(null,t.getURL())}const o=t.getTextContent(),i=T(o,e);if(null===i||i.text!==o)return P(t),void n(null,t.getURL());if(!L(t)||!R(t))return P(t),void n(null,t.getURL());const u=t.getURL();if(u!==i.url&&(t.setURL(i.url),n(i.url,u)),i.attributes){const e=t.getRel();e!==i.attributes.rel&&(t.setRel(i.attributes.rel||null),n(i.attributes.rel||null,e));const l=t.getTarget();l!==i.attributes.target&&(t.setTarget(i.attributes.target||null),n(i.attributes.target||null,l))}}function P(t){const e=t.getChildren();for(let n=e.length-1;n>=0;n--)t.insertAfter(e[n]);return t.remove(),e.map((t=>t.getLatest()))}function w(l,r,u){p((()=>{l.hasNodes([t])||d(77);const g=(t,e)=>{u&&u(t,e)};return o(l.registerNodeTransform(i,(t=>{const l=t.getParentOrThrow(),o=t.getPreviousSibling();if(e(l))D(l,r,g);else if(!n(l)){if(t.isSimpleText()&&(v(t.getTextContent())||!e(o))){const e=function(t){const e=[t];let n=t.getNextSibling();for(;null!==n&&s(n)&&n.isSimpleText()&&(e.push(n),!/[\s]/.test(n.getTextContent()));)n=n.getNextSibling();return e}(t);!function(t,e,n){let l=[...t];const r=l.map((t=>t.getTextContent())).join("");let o,i=r,s=0;for(;(o=T(i,e))&&null!==o;){const t=o.index,e=t+o.length;if(U(s+t,s+e,r,l)){const[r,,i,u]=N(l,s+t,s+e),g=y(i,s+t-r,s+e-r,o);l=g?[g,...u]:u,n(o.url,null),s=0}else s+=e;i=i.substring(e)}}(e,r,g)}!function(t,n,l){const r=t.getPreviousSibling(),o=t.getNextSibling(),i=t.getTextContent();e(r)&&!v(i)&&(r.append(t),D(r,n,l),l(null,r.getURL())),e(o)&&!S(i)&&(P(o),D(o,n,l),l(null,o.getURL()))}(t,r,g)}})))}),[l,r,u])}function F({matchers:t,onChange:e}){const[n]=r();return w(n,t,e),null}export{F as AutoLinkPlugin,m as createLinkMatcherWithRegExp};
