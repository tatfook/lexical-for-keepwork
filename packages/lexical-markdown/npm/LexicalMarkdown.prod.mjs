/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import{$getRoot as t,$isElementNode as e,$isDecoratorNode as n,$isLineBreakNode as o,$isTextNode as r,$getSelection as i,$createParagraphNode as s,$createTextNode as c,$isParagraphNode as l,$createLineBreakNode as a,$isRangeSelection as f,$isRootOrShadowRoot as u,$createRangeSelection as g,$setSelection as p}from"lexical";import{$isListNode as d,$isListItemNode as m,ListNode as h,ListItemNode as x,$createListItemNode as C,$createListNode as T}from"@lexical/list";import{$isQuoteNode as y,HeadingNode as v,$isHeadingNode as b,$createHeadingNode as w,QuoteNode as E,$createQuoteNode as $}from"@lexical/rich-text";import{$findMatchingParent as S}from"@lexical/utils";import{$isCodeNode as F,CodeNode as L,$createCodeNode as P}from"@lexical/code";import{LinkNode as R,$isLinkNode as k,$createLinkNode as M}from"@lexical/link";function _(t,e){const n={};for(const o of t){const t=e(o);n[t]?n[t].push(o):n[t]=[o]}return n}function N(t){const e=_(t,(t=>t.type));return{element:e.element||[],textFormat:e["text-format"]||[],textMatch:e["text-match"]||[]}}const O=/[!-/:-@[-`{-~\s]/;function j(t,o,r,i){for(const e of o){const n=e.export(t,(t=>z(t,o,r,i)));if(null!=n)return n}return e(t)?z(t,o,r,i):n(t)?t.getTextContent():null}function z(t,i,s,c){const l=[],a=t.getChildren();t:for(const t of a){if(e(t))for(const e of i){const n=e.export(t,(t=>z(t,i,s,c)));if(null!=n){l.push(n),a.indexOf(t)!==a.length-1&&l.push("\n");continue t}}for(const e of c){const n=e.export(t,(t=>z(t,i,s,c)),((t,e)=>A(t,e,s)));if(null!=n){l.push(n);continue t}}o(t)?l.push("\n"):r(t)?l.push(A(t,t.getTextContent(),s)):e(t)?(l.push(z(t,i,s,c)),a.indexOf(t)!==a.length-1&&l.push("\n","\n")):n(t)&&l.push(t.getTextContent())}return l.join("")}function A(t,e,n){const o=e.trim();let r=o;const i=new Set;for(const e of n){const n=e.format[0],o=e.tag;if(I(t,n)&&!i.has(n)){i.add(n);I(B(t,!0),n)||(r=o+r);I(B(t,!1),n)||(r+=o)}}return e.replace(o,(()=>r))}function B(t,n){let o=n?t.getPreviousSibling():t.getNextSibling();if(!o){const e=t.getParentOrThrow();e.isInline()&&(o=n?e.getPreviousSibling():e.getNextSibling())}for(;o;){if(e(o)){if(!o.isInline())break;const t=n?o.getLastDescendant():o.getFirstDescendant();if(r(t))return t;o=n?o.getPreviousSibling():o.getNextSibling()}if(r(o))return o;if(!e(o))return null}return null}function I(t,e){return r(t)&&t.hasFormat(e)}const U="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,D=U&&"documentMode"in document?document.documentMode:null;U&&"InputEvent"in window&&!D&&new window.InputEvent("input");const K=U&&/Version\/[\d.]+.*Safari/.test(navigator.userAgent),V=U&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,W=U&&/^(?=.*Chrome).*/i.test(navigator.userAgent),q=U&&/AppleWebKit\/[\d.]+/.test(navigator.userAgent)&&!W,G=/^\s{0,3}$/;function H(t,e,n){const o=e.length,r=function(t){const e={},n={},o=[],r="(?<![\\\\])";for(const r of t){const{tag:t}=r;e[t]=r;const i=t.replace(/(\*|\^|\+)/g,"\\$1");o.push(i),n[t]=K||V||q?new RegExp(`(${i})(?![${i}\\s])(.*?[^${i}\\s])${i}(?!${i})`):new RegExp(`(?<![\\\\${i}])(${i})((\\\\${i})?.*?[^${i}\\s](\\\\${i})?)((?<!\\\\)|(?<=\\\\\\\\))(${i})(?![\\\\${i}])`)}return{fullMatchRegExpByTag:n,openTagsRegExp:new RegExp((K||V||q?"":`${r}`)+"("+o.join("|")+")","g"),transformersByTag:e}}(n.textFormat);for(let i=0;i<o;){const l=e[i];let a=!1;for(const r of n.element){const f=l.match(r.regExp);if(r.getNumberOfLines){const l=r.getNumberOfLines(e,i);if(i+l>e.length)continue;if(f){if(r.recursivelyParse){const o=s();t.append(o),H(o,e.slice(i+1,i+l),n)}else{const n=c(e.slice(i+1,i+l).join("\n")),o=s();o.append(n),t.append(o)}r.replace(t.getLastChild(),t.getLastChild().getChildren(),f,!0),i+=l,i<o&&r.closeRegExp&&e[i].match(r.closeRegExp)&&i++,a=!0;break}}}a||(Y(l,t,n.element,r,n.textMatch),i++)}}function J(t){const n=t.getChildren();for(const t of n)X(t)?t.remove():e(t)&&J(t)}function Q(e){const n=N(e);return(e,o)=>{const r=e.split("\n"),s=o||t();s.clear(),H(s,r,n),J(s),null!==i()&&s.selectEnd()}}function X(t){if(!l(t))return!1;const e=t.getFirstChild();return null==e||1===t.getChildrenSize()&&r(e)&&G.test(e.getTextContent())}function Y(t,e,n,o,r){const i=t.trimEnd(),f=c(i),u=s();u.append(f),e.append(u);for(const{regExp:e,replace:o}of n){const n=t.match(e);if(n){const e=t.slice(n[0].length);f.setTextContent(e),o(u,[f],n,!0);break}}if(Z(f,o,r),u.isAttached()&&i.length>0){const t=u.getPreviousSibling();if(l(t)||y(t)||d(t)){let e=t;if(d(t)){const n=t.getLastDescendant();e=null==n?null:S(n,m)}null!=e&&e.getTextContentSize()>0&&(e.splice(e.getChildrenSize(),0,[a(),...u.getChildren()]),u.remove())}}}function Z(t,e,n){const o=t.getTextContent(),r=function(t,e){const n=t.match(e.openTagsRegExp);if(null==n)return null;for(const o of n){const n=o.replace(/^\s/,""),r=e.fullMatchRegExpByTag[n];if(null==r)continue;const i=t.match(r),s=e.transformersByTag[n];if(null!=i&&null!=s){if(!1!==s.intraword)return i;const{index:e=0}=i,n=t[e-1],o=t[e+i[0].length];if((!n||O.test(n))&&(!o||O.test(o)))return i}}return null}(o,e);if(!r)return void tt(t,n);let i,s,c;if(r[0]===o)i=t;else{const e=r.index||0,n=e+r[0].length;0===e?[i,s]=t.splitText(n):[c,i,s]=t.splitText(e,n)}i.setTextContent(r[2]);const l=e.transformersByTag[r[1]];if(l)for(const t of l.format)i.hasFormat(t)||i.toggleFormat(t);i.hasFormat("code")||Z(i,e,n),c&&Z(c,e,n),s&&Z(s,e,n)}function tt(t,e){let n=t;t:for(;n;){for(const t of e){const o=n.getTextContent().match(t.importRegExp);if(!o)continue;const r=o.index||0,i=r+o[0].length;let s,c;0===r?[s,n]=n.splitText(i):[,s,c]=n.splitText(r,i),c&&tt(c,e),t.replace(s,o);continue t}break}}function et(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var nt=et((function(t){const e=new URLSearchParams;e.append("code",t);for(let t=1;t<arguments.length;t++)e.append("v",arguments[t]);throw Error(`Minified Lexical error #${t}; visit https://lexical.dev/docs/error?${e} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`)}));function ot(t,e,n){const o=n.length;for(let r=e;r>=o;r--){const e=r-o;if(rt(t,e,n,0,o)&&" "!==t[e+o])return e}return-1}function rt(t,e,n,o,r){for(let i=0;i<r;i++)if(t[e+i]!==n[o+i])return!1;return!0}function it(t,e=Lt){const n=N(e),s=_(n.textFormat,(({tag:t})=>t[t.length-1])),c=_(n.textMatch,(({trigger:t})=>t));for(const n of e){const e=n.type;if("element"===e||"text-match"===e){const e=n.dependencies;for(const n of e)t.hasNode(n)||nt(173,n.getType())}}const l=(t,e,l)=>{(function(t,e,n,o){const r=t.getParent();if(!u(r)||t.getFirstChild()!==e)return!1;const i=e.getTextContent();if(" "!==i[n-1])return!1;for(const{regExp:r,replace:s}of o){const o=i.match(r);if(o&&o[0].length===n){const r=e.getNextSiblings(),[i,c]=e.splitText(n);return i.remove(),s(t,c?[c,...r]:r,o,!1),!0}}return!1})(t,e,l,n.element)||function(t,e,n){let o=t.getTextContent();const r=n[o[e-1]];if(null==r)return!1;e<o.length&&(o=o.slice(0,e));for(const e of r){const n=o.match(e.regExp);if(null===n)continue;const r=n.index||0,i=r+n[0].length;let s;return 0===r?[s]=t.splitText(i):[,s]=t.splitText(r,i),s.selectNext(0,0),e.replace(s,n),!0}return!1}(e,l,c)||function(t,e,n){const s=t.getTextContent(),c=e-1,l=s[c],a=n[l];if(!a)return!1;for(const e of a){const{tag:n}=e,a=n.length,u=c-a+1;if(a>1&&!rt(s,u,n,0,a))continue;if(" "===s[u-1])continue;const d=s[c+1];if(!1===e.intraword&&d&&!O.test(d))continue;const m=t;let h=m,x=ot(s,u,n),C=h;for(;x<0&&(C=C.getPreviousSibling())&&!o(C);)if(r(C)){const t=C.getTextContent();h=C,x=ot(t,t.length,n)}if(x<0)continue;if(h===m&&x+a===u)continue;const T=h.getTextContent();if(x>0&&T[x-1]===l)continue;const y=T[x-1];if(!1===e.intraword&&y&&!O.test(y))continue;const v=m.getTextContent(),b=v.slice(0,u)+v.slice(c+1);m.setTextContent(b);const w=h===m?b:T;h.setTextContent(w.slice(0,x)+w.slice(x+a));const E=i(),$=g();p($);const S=c-a*(h===m?2:1)+1;$.anchor.set(h.__key,x,"text"),$.focus.set(m.__key,S,"text");for(const t of e.format)$.hasFormat(t)||$.formatText(t);$.anchor.set($.focus.key,$.focus.offset,$.focus.type);for(const t of e.format)$.hasFormat(t)&&$.toggleFormat(t);return f(E)&&($.format=E.format),!0}}(e,l,s)};return t.registerUpdateListener((({tags:e,dirtyLeaves:n,editorState:o,prevEditorState:s})=>{if(e.has("collaboration")||e.has("historic"))return;if(t.isComposing())return;const c=o.read(i),a=s.read(i);if(!f(a)||!f(c)||!c.isCollapsed())return;const u=c.anchor.key,g=c.anchor.offset,p=o._nodeMap.get(u);!r(p)||!n.has(u)||1!==g&&g>a.anchor.offset+1||t.update((()=>{if(p.hasFormat("code"))return;const t=p.getParent();null===t||F(t)||l(t,p,c.anchor.offset)}))}))}const st=t=>(e,n,o)=>{const r=t(o);r.append(...n),e.replace(r)},ct=t=>(e,n,o)=>{const r=e.getPreviousSibling(),i=e.getNextSibling(),s=C("check"===t?"x"===o[3]:void 0);if(d(i)&&i.getListType()===t){const t=i.getFirstChild();null!==t?t.insertBefore(s):i.append(s),e.remove()}else if(d(r)&&r.getListType()===t)r.append(s),e.remove();else{const n=T(t,"number"===t?Number(o[2]):void 0);n.append(s),e.replace(n)}s.append(...n);const c=Math.floor(o[1].length/4);c&&s.setIndent(c)},lt=(t,e,n)=>{const o=[],r=t.getChildren();let i=0;for(const s of r)if(m(s)){if(1===s.getChildrenSize()){const t=s.getFirstChild();if(d(t)){o.push(lt(t,e,n+1));continue}}const r=" ".repeat(4*n),c=t.getListType(),l="number"===c?`${t.getStart()+i}. `:"check"===c?`- [${s.getChecked()?"x":" "}] `:"- ";o.push(r+l+e(s)),i++}return o.join("\n")},at={dependencies:[v],export:(t,e)=>{if(!b(t))return null;const n=Number(t.getTag().slice(1));return"#".repeat(n)+" "+e(t)},regExp:/^(#{1,6})\s/,replace:st((t=>{const e="h"+t[1].length;return w(e)})),type:"element"},ft={dependencies:[E],export:(t,e)=>{if(!y(t))return null;const n=e(t).split("\n"),o=[];for(const t of n)o.push("> "+t);return o.join("\n")},regExp:/^>\s/,replace:(t,e,n,o)=>{if(o){const n=t.getPreviousSibling();if(y(n))return n.splice(n.getChildrenSize(),0,[a(),...e]),void t.remove()}const r=$();r.append(...e),t.replace(r)},type:"element"},ut={closeRegExp:/^```$/,dependencies:[L],export:t=>{if(!F(t))return null;const e=t.getTextContent();return"```"+(t.getLanguage()||"")+(e?"\n"+e:"")+"\n```"},getNumberOfLines:(t,e)=>{const n=/^```(\w{1,10})?\s?$/;let o=e;const r=t.length;for(;++o<r;){if(t[o].match(n))return o-e}return o-e},regExp:/^```(\w{1,10})?\s?$/,replace:st((t=>P(t?t[1]:void 0))),type:"element"},gt={dependencies:[h,x],export:(t,e)=>d(t)?lt(t,e,0):null,regExp:/^(\s*)[-*+]\s/,replace:ct("bullet"),type:"element"},pt={dependencies:[h,x],export:(t,e)=>d(t)?lt(t,e,0):null,regExp:/^(\s*)(?:-\s)?\s?(\[(\s|x)?\])\s/i,replace:ct("check"),type:"element"},dt={dependencies:[h,x],export:(t,e)=>d(t)?lt(t,e,0):null,regExp:/^(\s*)(\d{1,})\.\s/,replace:ct("number"),type:"element"},mt={format:["code"],tag:"`",type:"text-format"},ht={format:["highlight"],tag:"==",type:"text-format"},xt={format:["bold","italic"],tag:"***",type:"text-format"},Ct={format:["bold","italic"],intraword:!1,tag:"___",type:"text-format"},Tt={format:["bold"],tag:"**",type:"text-format"},yt={format:["bold"],intraword:!1,tag:"__",type:"text-format"},vt={format:["strikethrough"],tag:"~~",type:"text-format"},bt={format:["italic"],tag:"*",type:"text-format"},wt={format:["italic"],intraword:!1,tag:"_",type:"text-format"},Et={dependencies:[R],export:(t,e,n)=>{if(!k(t))return null;const o=t.getTitle(),i=o?`[${t.getTextContent()}](${t.getURL()} "${o}")`:`[${t.getTextContent()}](${t.getURL()})`,s=t.getFirstChild();return 1===t.getChildrenSize()&&r(s)?n(s,i):i},importRegExp:/(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))/,regExp:/(?:\[([^[]+)\])(?:\((?:([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?)\))$/,replace:(t,e)=>{const[,n,o,r]=e,i=M(o,{title:r}),s=c(n);s.setFormat(t.getFormat()),i.append(s),t.replace(i)},trigger:")",type:"text-match"},$t=[at,ft,ut,gt,dt],St=[mt,xt,Ct,Tt,yt,ht,bt,wt,vt],Ft=[Et],Lt=[...$t,...St,...Ft];function Pt(t,e=Lt,n){return Q(e)(t,n)}function Rt(e=Lt,n){const o=function(e){const n=N(e),o=n.textFormat.filter((t=>1===t.format.length));return e=>{const r=[],i=(e||t()).getChildren();for(const t of i){const e=j(t,n.element,o,n.textMatch);null!=e&&r.push(e)}return r.join("\n\n")}}(e);return o(n)}export{Pt as $convertFromMarkdownString,Rt as $convertToMarkdownString,xt as BOLD_ITALIC_STAR,Ct as BOLD_ITALIC_UNDERSCORE,Tt as BOLD_STAR,yt as BOLD_UNDERSCORE,pt as CHECK_LIST,ut as CODE,$t as ELEMENT_TRANSFORMERS,at as HEADING,ht as HIGHLIGHT,mt as INLINE_CODE,bt as ITALIC_STAR,wt as ITALIC_UNDERSCORE,Et as LINK,dt as ORDERED_LIST,ft as QUOTE,vt as STRIKETHROUGH,St as TEXT_FORMAT_TRANSFORMERS,Ft as TEXT_MATCH_TRANSFORMERS,Lt as TRANSFORMERS,gt as UNORDERED_LIST,st as createBlockNode,it as registerMarkdownShortcuts};
