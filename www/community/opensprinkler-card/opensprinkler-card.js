/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function t(t,e,i,n){var s,r=arguments.length,o=r<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(r<3?s(o):r>3?s(e,i,o):s(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const e=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new Map;class s{constructor(t,e){if(this._$cssResult$=!0,e!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){let t=n.get(this.cssText);return e&&void 0===t&&(n.set(this.cssText,t=new CSSStyleSheet),t.replaceSync(this.cssText)),t}toString(){return this.cssText}}const r=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new s(n,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var a;const l=window.trustedTypes,c=l?l.emptyScript:"",h=window.reactiveElementPolyfillSupport,d={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},u=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:d,reflect:!1,hasChanged:u};class m extends HTMLElement{constructor(){super(),this._$Et=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Ei=null,this.o()}static addInitializer(t){var e;null!==(e=this.l)&&void 0!==e||(this.l=[]),this.l.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const n=this._$Eh(i,e);void 0!==n&&(this._$Eu.set(n,i),t.push(n))})),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,n=this.getPropertyDescriptor(t,i,e);void 0!==n&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(n){const s=this[t];this[e]=n,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Eu=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eh(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}o(){var t;this._$Ep=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Em(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$Eg)&&void 0!==e?e:this._$Eg=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$Eg)||void 0===e||e.splice(this._$Eg.indexOf(t)>>>0,1)}_$Em(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Et.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const i=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{e?t.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):i.forEach((e=>{const i=document.createElement("style"),n=window.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=e.cssText,t.appendChild(i)}))})(i,this.constructor.elementStyles),i}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ES(t,e,i=p){var n,s;const r=this.constructor._$Eh(t,i);if(void 0!==r&&!0===i.reflect){const o=(null!==(s=null===(n=i.converter)||void 0===n?void 0:n.toAttribute)&&void 0!==s?s:d.toAttribute)(e,i.type);this._$Ei=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Ei=null}}_$AK(t,e){var i,n,s;const r=this.constructor,o=r._$Eu.get(t);if(void 0!==o&&this._$Ei!==o){const t=r.getPropertyOptions(o),a=t.converter,l=null!==(s=null!==(n=null===(i=a)||void 0===i?void 0:i.fromAttribute)&&void 0!==n?n:"function"==typeof a?a:null)&&void 0!==s?s:d.fromAttribute;this._$Ei=o,this[o]=l(e,t.type),this._$Ei=null}}requestUpdate(t,e,i){let n=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Ei!==t&&(void 0===this._$E_&&(this._$E_=new Map),this._$E_.set(t,i))):n=!1),!this.isUpdatePending&&n&&(this._$Ep=this._$EC())}async _$EC(){this.isUpdatePending=!0;try{await this._$Ep}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Et&&(this._$Et.forEach(((t,e)=>this[e]=t)),this._$Et=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$Eg)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$Eg)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Ep}shouldUpdate(t){return!0}update(t){void 0!==this._$E_&&(this._$E_.forEach(((t,e)=>this._$ES(e,this[e],t))),this._$E_=void 0),this._$EU()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;m.finalized=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==h||h({ReactiveElement:m}),(null!==(a=globalThis.reactiveElementVersions)&&void 0!==a?a:globalThis.reactiveElementVersions=[]).push("1.0.2");const f=globalThis.trustedTypes,v=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,_=`lit$${(Math.random()+"").slice(9)}$`,y="?"+_,b=`<${y}>`,$=document,w=(t="")=>$.createComment(t),x=t=>null===t||"object"!=typeof t&&"function"!=typeof t,S=Array.isArray,A=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,k=/-->/g,E=/>/g,C=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,M=/'/g,D=/"/g,O=/^(?:script|style|textarea)$/i,N=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),H=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),P=new WeakMap,R=$.createTreeWalker($,129,null,!1);class U{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,r=0;const o=t.length-1,a=this.parts,[l,c]=((t,e)=>{const i=t.length-1,n=[];let s,r=2===e?"<svg>":"",o=A;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===A?"!--"===l[1]?o=k:void 0!==l[1]?o=E:void 0!==l[2]?(O.test(l[2])&&(s=RegExp("</"+l[2],"g")),o=C):void 0!==l[3]&&(o=C):o===C?">"===l[0]?(o=null!=s?s:A,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?C:'"'===l[3]?D:M):o===D||o===M?o=C:o===k||o===E?o=A:(o=C,s=void 0);const d=o===C&&t[e+1].startsWith("/>")?" ":"";r+=o===A?i+b:c>=0?(n.push(a),i.slice(0,c)+"$lit$"+i.slice(c)+_+d):i+_+(-2===c?(n.push(void 0),e):d)}const a=r+(t[i]||"<?>")+(2===e?"</svg>":"");return[void 0!==v?v.createHTML(a):a,n]})(t,e);if(this.el=U.createElement(l,i),R.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(n=R.nextNode())&&a.length<o;){if(1===n.nodeType){if(n.hasAttributes()){const t=[];for(const e of n.getAttributeNames())if(e.endsWith("$lit$")||e.startsWith(_)){const i=c[r++];if(t.push(e),void 0!==i){const t=n.getAttribute(i.toLowerCase()+"$lit$").split(_),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?z:"?"===e[1]?B:"@"===e[1]?W:Y})}else a.push({type:6,index:s})}for(const e of t)n.removeAttribute(e)}if(O.test(n.tagName)){const t=n.textContent.split(_),e=t.length-1;if(e>0){n.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],w()),R.nextNode(),a.push({type:2,index:++s});n.append(t[e],w())}}}else if(8===n.nodeType)if(n.data===y)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(_,t+1));)a.push({type:7,index:s}),t+=_.length-1}s++}}static createElement(t,e){const i=$.createElement("template");return i.innerHTML=t,i}}function j(t,e,i=t,n){var s,r,o,a;if(e===H)return e;let l=void 0!==n?null===(s=i._$Cl)||void 0===s?void 0:s[n]:i._$Cu;const c=x(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(r=null==l?void 0:l._$AO)||void 0===r||r.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,n)),void 0!==n?(null!==(o=(a=i)._$Cl)&&void 0!==o?o:a._$Cl=[])[n]=l:i._$Cu=l),void 0!==l&&(e=j(t,l._$AS(t,e.values),l,n)),e}class L{constructor(t,e){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var e;const{el:{content:i},parts:n}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:$).importNode(i,!0);R.currentNode=s;let r=R.nextNode(),o=0,a=0,l=n[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new I(r,r.nextSibling,this,t):1===l.type?e=new l.ctor(r,l.name,l.strings,this,t):6===l.type&&(e=new Z(r,this,t)),this.v.push(e),l=n[++a]}o!==(null==l?void 0:l.index)&&(r=R.nextNode(),o++)}return s}m(t){let e=0;for(const i of this.v)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class I{constructor(t,e,i,n){var s;this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cg=null===(s=null==n?void 0:n.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cg}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=j(this,t,e),x(t)?t===T||null==t||""===t?(this._$AH!==T&&this._$AR(),this._$AH=T):t!==this._$AH&&t!==H&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.S(t):(t=>{var e;return S(t)||"function"==typeof(null===(e=t)||void 0===e?void 0:e[Symbol.iterator])})(t)?this.M(t):this.$(t)}A(t,e=this._$AB){return this._$AA.parentNode.insertBefore(t,e)}S(t){this._$AH!==t&&(this._$AR(),this._$AH=this.A(t))}$(t){this._$AH!==T&&x(this._$AH)?this._$AA.nextSibling.data=t:this.S($.createTextNode(t)),this._$AH=t}T(t){var e;const{values:i,_$litType$:n}=t,s="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=U.createElement(n.h,this.options)),n);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.m(i);else{const t=new L(s,this),e=t.p(this.options);t.m(i),this.S(e),this._$AH=t}}_$AC(t){let e=P.get(t.strings);return void 0===e&&P.set(t.strings,e=new U(t)),e}M(t){S(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new I(this.A(w()),this.A(w()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cg=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Y{constructor(t,e,i,n,s){this.type=1,this._$AH=T,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=T}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,n){const s=this.strings;let r=!1;if(void 0===s)t=j(this,t,e,0),r=!x(t)||t!==this._$AH&&t!==H,r&&(this._$AH=t);else{const n=t;let o,a;for(t=s[0],o=0;o<s.length-1;o++)a=j(this,n[i+o],e,o),a===H&&(a=this._$AH[o]),r||(r=!x(a)||a!==this._$AH[o]),a===T?t=T:t!==T&&(t+=(null!=a?a:"")+s[o+1]),this._$AH[o]=a}r&&!n&&this.k(t)}k(t){t===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class z extends Y{constructor(){super(...arguments),this.type=3}k(t){this.element[this.name]=t===T?void 0:t}}const F=f?f.emptyScript:"";class B extends Y{constructor(){super(...arguments),this.type=4}k(t){t&&t!==T?this.element.setAttribute(this.name,F):this.element.removeAttribute(this.name)}}class W extends Y{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=j(this,t,e,0))&&void 0!==i?i:T)===H)return;const n=this._$AH,s=t===T&&n!==T||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,r=t!==T&&(n===T||s);s&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Z{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){j(this,t)}}const V=window.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var q,J;null==V||V(U,I),(null!==(g=globalThis.litHtmlVersions)&&void 0!==g?g:globalThis.litHtmlVersions=[]).push("2.0.2");class K extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Dt=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Dt=((t,e,i)=>{var n,s;const r=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:e;let o=r._$litPart$;if(void 0===o){const t=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;r._$litPart$=o=new I(e.insertBefore(w(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Dt)||void 0===t||t.setConnected(!1)}render(){return H}}K.finalized=!0,K._$litElement$=!0,null===(q=globalThis.litElementHydrateSupport)||void 0===q||q.call(globalThis,{LitElement:K});const G=globalThis.litElementPolyfillSupport;null==G||G({LitElement:K}),(null!==(J=globalThis.litElementVersions)&&void 0!==J?J:globalThis.litElementVersions=[]).push("3.0.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q=t=>e=>"function"==typeof e?((t,e)=>(window.customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:n}=e;return{kind:i,elements:n,finisher(e){window.customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,X=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function tt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):X(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}function et(t){return tt({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const it=1,nt=t=>(...e)=>({_$litDirective$:t,values:e});class st{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rt=nt(class extends st{constructor(t){var e;if(super(t),t.type!==it||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const n=t[i];return null==n?e:e+`${i=i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ut){this.ut=new Set;for(const t in e)this.ut.add(t);return this.render(e)}this.ut.forEach((t=>{null==e[t]&&(this.ut.delete(t),t.includes("-")?i.removeProperty(t):i[t]="")}));for(const t in e){const n=e[t];null!=n&&(this.ut.add(t),t.includes("-")?i.setProperty(t,n):i[t]=n)}return H}});var ot=/d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,at="[^\\s]+",lt=/\[([^]*?)\]/gm;function ct(t,e){for(var i=[],n=0,s=t.length;n<s;n++)i.push(t[n].substr(0,e));return i}var ht=function(t){return function(e,i){var n=i[t].map((function(t){return t.toLowerCase()})).indexOf(e.toLowerCase());return n>-1?n:null}};function dt(t){for(var e=[],i=1;i<arguments.length;i++)e[i-1]=arguments[i];for(var n=0,s=e;n<s.length;n++){var r=s[n];for(var o in r)t[o]=r[o]}return t}var ut=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],pt=["January","February","March","April","May","June","July","August","September","October","November","December"],mt=ct(pt,3),gt={dayNamesShort:ct(ut,3),dayNames:ut,monthNamesShort:mt,monthNames:pt,amPm:["am","pm"],DoFn:function(t){return t+["th","st","nd","rd"][t%10>3?0:(t-t%10!=10?1:0)*t%10]}},ft=dt({},gt),vt=function(t,e){for(void 0===e&&(e=2),t=String(t);t.length<e;)t="0"+t;return t},_t={D:function(t){return String(t.getDate())},DD:function(t){return vt(t.getDate())},Do:function(t,e){return e.DoFn(t.getDate())},d:function(t){return String(t.getDay())},dd:function(t){return vt(t.getDay())},ddd:function(t,e){return e.dayNamesShort[t.getDay()]},dddd:function(t,e){return e.dayNames[t.getDay()]},M:function(t){return String(t.getMonth()+1)},MM:function(t){return vt(t.getMonth()+1)},MMM:function(t,e){return e.monthNamesShort[t.getMonth()]},MMMM:function(t,e){return e.monthNames[t.getMonth()]},YY:function(t){return vt(String(t.getFullYear()),4).substr(2)},YYYY:function(t){return vt(t.getFullYear(),4)},h:function(t){return String(t.getHours()%12||12)},hh:function(t){return vt(t.getHours()%12||12)},H:function(t){return String(t.getHours())},HH:function(t){return vt(t.getHours())},m:function(t){return String(t.getMinutes())},mm:function(t){return vt(t.getMinutes())},s:function(t){return String(t.getSeconds())},ss:function(t){return vt(t.getSeconds())},S:function(t){return String(Math.round(t.getMilliseconds()/100))},SS:function(t){return vt(Math.round(t.getMilliseconds()/10),2)},SSS:function(t){return vt(t.getMilliseconds(),3)},a:function(t,e){return t.getHours()<12?e.amPm[0]:e.amPm[1]},A:function(t,e){return t.getHours()<12?e.amPm[0].toUpperCase():e.amPm[1].toUpperCase()},ZZ:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+vt(100*Math.floor(Math.abs(e)/60)+Math.abs(e)%60,4)},Z:function(t){var e=t.getTimezoneOffset();return(e>0?"-":"+")+vt(Math.floor(Math.abs(e)/60),2)+":"+vt(Math.abs(e)%60,2)}},yt=function(t){return+t-1},bt=[null,"[1-9]\\d?"],$t=[null,at],wt=["isPm",at,function(t,e){var i=t.toLowerCase();return i===e.amPm[0]?0:i===e.amPm[1]?1:null}],xt=["timezoneOffset","[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",function(t){var e=(t+"").match(/([+-]|\d\d)/gi);if(e){var i=60*+e[1]+parseInt(e[2],10);return"+"===e[0]?i:-i}return 0}],St=(ht("monthNamesShort"),ht("monthNames"),{default:"ddd MMM DD YYYY HH:mm:ss",shortDate:"M/D/YY",mediumDate:"MMM D, YYYY",longDate:"MMMM D, YYYY",fullDate:"dddd, MMMM D, YYYY",isoDate:"YYYY-MM-DD",isoDateTime:"YYYY-MM-DDTHH:mm:ssZ",shortTime:"HH:mm",mediumTime:"HH:mm:ss",longTime:"HH:mm:ss.SSS"});var At=function(t,e,i){if(void 0===e&&(e=St.default),void 0===i&&(i={}),"number"==typeof t&&(t=new Date(t)),"[object Date]"!==Object.prototype.toString.call(t)||isNaN(t.getTime()))throw new Error("Invalid Date pass to format");var n=[];e=(e=St[e]||e).replace(lt,(function(t,e){return n.push(e),"@@@"}));var s=dt(dt({},ft),i);return(e=e.replace(ot,(function(e){return _t[e](t,s)}))).replace(/@@@/g,(function(){return n.shift()}))};var kt,Et,Ct=function(){try{(new Date).toLocaleDateString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleDateString(e.language,{year:"numeric",month:"long",day:"numeric"})}:function(t){return At(t,"mediumDate")},Mt=function(){try{(new Date).toLocaleString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleString(e.language,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return At(t,"haDateTime")},Dt=function(){try{(new Date).toLocaleTimeString("i")}catch(t){return"RangeError"===t.name}return!1}()?function(t,e){return t.toLocaleTimeString(e.language,{hour:"numeric",minute:"2-digit"})}:function(t){return At(t,"shortTime")},Ot=function(t){return t<10?"0"+t:t};function Nt(t){var e=Math.floor(t/3600),i=Math.floor(t%3600/60),n=Math.floor(t%3600%60);return e>0?e+":"+Ot(i)+":"+Ot(n):i>0?i+":"+Ot(n):n>0?""+n:null}function Ht(t){return t.substr(0,t.indexOf("."))}function Tt(t){var e=t.locale.language||"en";return t.translationMetadata.translations[e]&&t.translationMetadata.translations[e].isRTL||!1}!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(kt||(kt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Et||(Et={}));var Pt=function(t,e,i){var n;switch(null==e?void 0:e.number_format){case kt.comma_decimal:n=["en-US","en"];break;case kt.decimal_comma:n=["de","es","it"];break;case kt.space_comma:n=["fr","sv","cs"];break;case kt.system:n=void 0;break;default:n=null==e?void 0:e.language}if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},!Number.isNaN(Number(t))&&Intl&&(null==e?void 0:e.number_format)!==kt.none)try{return new Intl.NumberFormat(n,Rt(t,i)).format(Number(t))}catch(e){return console.error(e),new Intl.NumberFormat(void 0,Rt(t,i)).format(Number(t))}return t?t.toString():""},Rt=function(t,e){var i=e||{};if("string"!=typeof t)return i;if(!e||!e.minimumFractionDigits&&!e.maximumFractionDigits){var n=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=n,i.maximumFractionDigits=n}return i};function Ut(t,e,i,n){var s=void 0!==n?n:e.state;if("unknown"===s||"unavailable"===s)return t("state.default."+s);if(e.attributes.unit_of_measurement)return Pt(s,i)+" "+e.attributes.unit_of_measurement;var r=function(t){return Ht(t.entity_id)}(e);if("input_datetime"===r){var o;if(!e.attributes.has_time)return o=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day),Ct(o,i);if(!e.attributes.has_date){var a=new Date;return o=new Date(a.getFullYear(),a.getMonth(),a.getDay(),e.attributes.hour,e.attributes.minute),Dt(o,i)}return o=new Date(e.attributes.year,e.attributes.month-1,e.attributes.day,e.attributes.hour,e.attributes.minute),Mt(o,i)}return"humidifier"===r&&"on"===s&&e.attributes.humidity?e.attributes.humidity+" %":"counter"===r||"number"===r?Pt(s,i):e.attributes.device_class&&t("component."+r+".state."+e.attributes.device_class+"."+e.state)||t("component."+r+".state._."+e.state)||e.state}var jt=["closed","locked","off"],Lt=function(t,e,i,n){n=n||{},i=null==i?{}:i;var s=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return s.detail=i,t.dispatchEvent(s),s},It=function(t){Lt(window,"haptic",t)},Yt=function(t,e){return function(t,e,i){void 0===i&&(i=!0);var n,s=Ht(e),r="group"===s?"homeassistant":s;switch(s){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}return t.callService(r,n,{entity_id:e})}(t,e,jt.includes(t.states[e].state))},zt=function(t,e,i,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||(It("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(i.entity||i.camera_image)&&Lt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":n.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),Lt(window,"location-changed",{replace:i})}(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":i.entity&&(Yt(e,i.entity),It("success"));break;case"call-service":if(!n.service)return void It("failure");var s=n.service.split(".",2);e.callService(s[0],s[1],n.service_data),It("success");break;case"fire-dom-event":Lt(t,"ll-custom",n)}};function Ft(t){return void 0!==t&&"none"!==t.action}function Bt(t,e){try{const i=function(t){var e=t.split(":").map(Number);return 3600*e[0]+60*e[1]+e[2]}(t);if(isNaN(i))throw new Error(`Error parsing ${e} ${t}: check it matches the format 0:10:00`);return i}catch(i){throw new Error(`Could not convert ${e}: ${t} is not of format 0:10:00. If you are passing in a number, specify the units property.`)}}function Wt(t,e,i){const n=Kt(t,i,e.duration);if(n)return n;const s=Jt(t,i,e.start_time),r=Jt(t,i,e.end_time);return s&&r?(Date.parse(r)-Date.parse(s))/1e3:r?(Date.parse(r)-Date.parse(i.last_changed))/1e3:null}const Zt=(t,e,i)=>{const n=new Date(i.last_changed).getTime();if(i.attributes.remaining){let t=Bt(i.attributes.remaining,"remaining");if(qt(i,e.active_state)){const e=(new Date).getTime();t=Math.max(t-(e-n)/1e3,0)}return t}const s=Jt(t,i,e.end_time);if(s)return(Date.parse(s)-Date.now())/1e3;const r=Jt(t,i,e.start_time),o=Kt(t,i,e.duration);return r&&o?(Date.parse(r)-Date.now())/1e3+o:o?(n-Date.now())/1e3+o:void 0},Vt=(t,e,i)=>{const n=Zt(t,e,i),s=Wt(t,e,i);if(s&&n)return(s-Math.floor(n))/s*100},qt=(t,e)=>!!t&&("string"==typeof e?t.state===e:e.includes(t.state)),Jt=(t,e,i)=>{if(!i)throw new Error("One of duration, start_time, or end_time was not fully specified. Make sure you set entity, fixed, or attribute");return"fixed"in i?i.fixed:"entity"in i?t.states[i.entity].state:"state"in i?e.state:e.attributes[i.attribute]},Kt=(t,e,i)=>{const n=Jt(t,e,i);if(!n)return n;if("hours"===i.units||"minutes"===i.units||"seconds"===i.units){const t=Number(n);if(isNaN(t))throw new Error(`Expected duration ${n} to be a number since units is ${i.units}`);if("hours"==i.units)return 3600*t;if("minutes"==i.units)return 60*t;if("seconds"==i.units)return 1*t}return Bt(n,"duration")};function Gt(t,e){const i=t.states[e.entity];if(function(t,e,i){const n=Kt(t,i,e.duration),s=Jt(t,i,e.start_time),r=Jt(t,i,e.end_time);return!n&&!r||!n&&!s||!r&&!s}(t,e,i))return;const n=Qt(t,e);if("pause"===n||"waiting"===n)return;const s=Wt(t,e,i),r=Zt(t,e,i);return s&&r&&r>=0&&r<=s?"active":void 0}function Qt(t,e){const i=t.states[e.entity];return qt(i,e.active_state)&&(Zt(t,e,i)||0)>0?"active":qt(i,e.pause_state)?"pause":qt(i,e.waiting_state)?"waiting":"idle"}const Xt=(t,e)=>{const i=(()=>{const t=document.body;if(t.querySelector("action-handler"))return t.querySelector("action-handler");const e=document.createElement("action-handler");return t.appendChild(e),e})();i&&i.bind(t,e)},te=nt(class extends st{update(t,[e]){return Xt(t.element,e),H}render(t){}});function ee(t,e,i){if(!e||!i)return N``;const n=i.entity?e.states[i.entity]:void 0;if(!n)return N`<hui-warning>Entity ${i.entity} not found</hui-warning>`;const s=i.name||(t=>{return void 0===t.attributes.friendly_name?(e=t.entity_id,e.substr(e.indexOf(".")+1)).replace(/_/g," "):t.attributes.friendly_name||"";var e})(n),r=t=>{!function(t,e,i,n){var s;"double_tap"===n&&i.double_tap_action?s=i.double_tap_action:"hold"===n&&i.hold_action?s=i.hold_action:"tap"===n&&i.tap_action&&(s=i.tap_action),zt(t,e,i,s)}(t.target,e,i,t.detail.action)};return N`<div class="generic-entity-row">
    <state-badge
      class="pointer"
      .hass=${e}
      .stateObj=${n}
      .overrideIcon=${i.icon}
      .overrideImage=${i.image}
      .stateColor=${i.state_color}
      @action=${r}
      .actionHandler=${te({hasHold:Ft(i.hold_action),hasDoubleClick:Ft(i.double_tap_action)})}
      tabindex="0"
    ></state-badge>
    <div
      class="info pointer"
      @action=${r}
      .actionHandler=${te({hasHold:Ft(i.hold_action),hasDoubleClick:Ft(i.double_tap_action)})}
      .title=${s}
    >
      ${s}
    </div>
    ${t}
  </div>`}const ie=r`
  .generic-entity-row {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
  .info {
    margin-left: 16px;
    margin-right: 8px;
    flex: 1 1 30%;
  }
  .info,
  .info > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  state-badge {
    flex: 0 0 40px;
  }
`;function ne(t,e,i,n){if(!e)return"";if(n&&n[e])return n[e];if(i){const n=Ut(t.localize,i,t.locale,e);if(n!==e)return n}const s=function(t,e){return"idle"===e?t.localize("component.timer.state._.idle"):"paused"===e?t.localize("component.timer.state._.paused"):"active"===e?t.localize("component.timer.state._.active"):"on"===e?t.localize("component.switch.state._.on"):void 0}(t,e);return s||e[0].toUpperCase()+e.substring(1)}class se extends K{disconnectedCallback(){super.disconnectedCallback(),this._clearInterval()}connectedCallback(){var t;if(super.connectedCallback(),this.config&&this.config.entity){const e=null===(t=this.hass)||void 0===t?void 0:t.states[this.config.entity];e&&this._startInterval(e)}}_mode(){return t=this.hass,(e=this.config).guess_mode&&Gt(t,e)||Qt(t,e);var t,e}render(){var t,e;const i=this.hass.states[this.config.entity];if(this._error)return N`<hui-warning>${this._error.message}</hui-warning>`;let n,s=0;i&&(s=null!==(t=Vt(this.hass,this.config,i))&&void 0!==t?t:0),s>100&&(s=100);try{n=Object.assign(Object.assign({},this.modConfig),{icon:null!==(e=this.modConfig.active_icon)&&void 0!==e?e:this.modConfig.icon})}catch(t){return N`<div>${t}</div>`}switch(this._mode()){case"active":return this._renderRow(n,N`
        ${this._renderBar(s)}
        <div class="text-content" style=${this._textStyle()}>
          ${Nt(this._timeRemaining||0)}
        </div>
      `);case"pause":return this._renderRow(n,N`
        <div class="status pointer" style=${this._statusStyle()} @click=${this._handleClick}>
          ${ne(this.hass,i.state,i,this.config.translations)}
        </div>
        <div class="text-content" style=${this._textStyle()}>
          ${Nt(this._timeRemaining||0)}
        </div>
      `);case"waiting":return this._renderRow(this.modConfig,N`
        <div class="status pointer" style=${this._statusStyle(!0)} @click=${this._handleClick}>
          ${ne(this.hass,"scheduled_for",void 0,this.config.translations)} ${(t=>{const e=new Date(t.attributes.start_time),i=JSON.parse(localStorage.getItem("selectedLanguage")||'"en"')||"en";return Dt(e,i)})(i)}
        </div>
      `);default:const t=this.modConfig.text_width&&0===parseInt(this.modConfig.text_width)?"visibility: hidden":"";return this._renderRow(this.modConfig,N`
        <div class="text-content" style=${t}>${ne(this.hass,null==i?void 0:i.state,i,this.config.translations)}</div>
      `)}}_renderRow(t,e){return this.modConfig.full_row?N`<div class="flex">${e}</div>${this._renderDebug()}`:N`
      ${ee(e,this.hass,t)}
      ${this._renderDebug()}
    `}get _bar_width(){return this.modConfig.full_row?`calc(100% - ${this.modConfig.text_width})`:this.modConfig.bar_width}_renderBar(t){const e=rt({width:this._bar_width,direction:this.modConfig.bar_direction}),i=this._barStyle("100%",this.modConfig.bar_background),n=this._barStyle(t+"%",this.modConfig.bar_foreground);return N`<div class="bar-container pointer" style=${e} @click=${this._handleClick}>
      <div class="bar" style=${i}>
        <div style=${n}>
      </div>
    </div>`}_renderDebug(){if(!this.config.debug)return;const t=this.hass.states[this.config.entity];if(!t)return N`<code>No state found</code>`;const e=this.config.guess_mode?"used":"unused";return N`<code>
      State: ${t.state} (state mode = ${Qt(this.hass,this.config)||"N/A"})<br>
      Mode: ${this._mode()} (auto mode = ${Gt(this.hass,this.config)||"N/A"}, ${e})<br>
      Duration: ${Wt(this.hass,this.config,t)} second<br>
      Time remaining: ${Zt(this.hass,this.config,t)}<br>
      Counter: ${this._timeRemaining}<br>
      <small>Attr: ${JSON.stringify(t.attributes)}</small>
    </code>`}_handleClick(){const t=new Event("hass-more-info",{composed:!0});t.detail={entityId:this.config.entity},this.dispatchEvent(t)}shouldUpdate(t){return!!this.config&&(!!t.has("_timeRemaining")||function(t,e,i){if(e.has("config")||i)return!0;if(t.config.entity){var n=e.get("hass");return!n||n.states[t.config.entity]!==t.hass.states[t.config.entity]}return!1}(this,t,!1))}updated(t){if(super.updated(t),t.has("hass")){const e=this.hass.states[this.config.entity],i=t.get("hass");(null==i?void 0:i.states[this.config.entity])!==e?this._startInterval(e):e||this._clearInterval()}}_clearInterval(){this._interval&&(window.clearInterval(this._interval),this._interval=void 0)}_startInterval(t){this._clearInterval(),this._calculateRemaining(t),"active"===this._mode()&&(this._interval=window.setInterval((()=>this._calculateRemaining(t)),1e3))}_calculateRemaining(t){try{this._timeRemaining=Zt(this.hass,this.config,t),this._error=void 0}catch(t){console.error(t),this._error=t}}_barStyle(t,e){return rt({width:t,background:e,height:this.modConfig.bar_height})}_textStyle(){return rt({width:this.modConfig.text_width,"flex-shrink":"0"})}_statusStyle(t){let e=this._bar_width;return t&&(e=`calc(${this._bar_width} + ${this.modConfig.text_width})`),rt({width:e,color:"var(--secondary-text-color, #eee)"})}static get styles(){return[r`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .pointer { cursor: pointer; }
      .flex { display: flex; height: 40px; align-items: center; justify-content: flex-end; }
      .bar-container {
        min-height: 1.5em;
        display: flex;
        flex-shrink: 0;
        align-items: center;
      }
      .bar { margin-top: 2px; }
      .status { line-height: 1.5em; flex-shrink: 0; }
      .text-content { text-align: right; text-align: end; overflow: hidden; }
      code {
        display: block;
        background-color: var(--secondary-background-color);
        margin: 0.5em 0 0 0;
        padding: 0.7rem;
        font-size: 0.9em;
        word-break: break-all;
      }
    `,ie]}get modConfig(){var t,e,i;if(!this.config.modifications)return this.config;const n=this.hass.states[this.config.entity],s=null!==(t=Zt(this.hass,this.config,n))&&void 0!==t?t:1/0,r=(null!==(e=Wt(this.hass,this.config,n))&&void 0!==e?e:0)-s,o=null!==(i=Vt(this.hass,this.config,n))&&void 0!==i?i:0,a=100-o;let l=this.config;for(const t of this.config.modifications){if(t.greater_than_eq||t.greater_than)throw new Error("Mod format has changed! See the release notes and readme for details");t.remaining&&"string"==typeof t.remaining&&t.remaining.endsWith("%")?a<=parseFloat(t.remaining)&&(l=Object.assign(Object.assign({},l),t)):t.remaining?s<=Bt(t.remaining,"remaining")&&(l=Object.assign(Object.assign({},l),t)):t.elapsed&&"string"==typeof t.elapsed&&t.elapsed.endsWith("%")?o>=parseFloat(t.elapsed)&&(l=Object.assign(Object.assign({},l),t)):t.elapsed&&r>=Bt(t.elapsed,"elapsed")&&(l=Object.assign(Object.assign({},l),t))}return l}}t([tt()],se.prototype,"hass",void 0),t([tt()],se.prototype,"config",void 0),t([et()],se.prototype,"_interval",void 0),t([et()],se.prototype,"_timeRemaining",void 0),t([et()],se.prototype,"_error",void 0);const re=t=>{let e=[];function i(i,n){t=n?i:Object.assign(Object.assign({},t),i);let s=e;for(let e=0;e<s.length;e++)s[e](t)}return{get state(){return t},action(e){function n(t){i(t,!1)}return function(){let i=[t];for(let t=0;t<arguments.length;t++)i.push(arguments[t]);let s=e.apply(this,i);if(null!=s)return s instanceof Promise?s.then(n):n(s)}},setState:i,subscribe:t=>(e.push(t),()=>{!function(t){let i=[];for(let n=0;n<e.length;n++)e[n]===t?t=null:i.push(e[n]);e=i}(t)})}},oe=(t,e,i,n,s)=>((t,e,i,n)=>{if(t[e])return t[e];let s,r=0,o=re();const a=()=>i(t).then((t=>o.setState(t,!0))),l=()=>a().catch((e=>{if(t.connected)throw e}));return t[e]={get state(){return o.state},refresh:a,subscribe(e){r++,1===r&&(n&&(s=n(t,o)),t.addEventListener("ready",l),l());const i=o.subscribe(e);return void 0!==o.state&&setTimeout((()=>e(o.state)),0),()=>{i(),r--,r||(s&&s.then((t=>{t()})),t.removeEventListener("ready",a))}}},t[e]})(n,t,e,i).subscribe(s),ae=t=>t.sendMessagePromise({type:"config/entity_registry/list"}),le=(t,e)=>t.subscribeEvents(function(t,e,i){var n;return void 0===i&&(i=!1),function(){var s=[].slice.call(arguments),r=this,o=function(){n=null,i||t.apply(r,s)},a=i&&!n;clearTimeout(n),n=setTimeout(o,e),a&&t.apply(r,s)}}((()=>ae(t).then((t=>e.setState(t,!0)))),500,!0),"entity_registry_updated"),ce=r`
  opensprinkler-timer-bar-entity-row {
    height: var(--opensprinkler-timer-height);
  }

  opensprinkler-state {
    height: var(--opensprinkler-line-height);
    color: var(--primary-text-color);
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .header {
    margin-left: 56px;
    margin-top: 16px;
    color: var(--secondary-text-color);
  }
`;let he=class extends K{constructor(){super(...arguments),this._initialized=!1}setConfig(t){this._config=t,this.loadCardHelpers()}shouldUpdate(){return this._initialized||this._initialize(),!0}_computeLabel(t){return"device"==t.name?"Device (Required)":"name"==t.name?"Name (Optional)":""}render(){if(!this.hass||!this._helpers)return N``;return N`
      <div class="card-config">
          <ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${[{name:"device",selector:{device:{integration:"opensprinkler",manufacturer:"OpenSprinkler"}}},{name:"name",selector:{text:{}}}]}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._valueChanged}
          ></ha-form>
      </div>
    `}_initialize(){void 0!==this.hass&&void 0!==this._config&&void 0!==this._helpers&&(this._initialized=!0)}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}_valueChanged(t){Lt(this,"config-changed",{config:t.detail.value})}static get styles(){return r`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
        display: grid;
      }
      ha-formfield {
        padding-bottom: 8px;
      }
    `}};t([tt({attribute:!1})],he.prototype,"hass",void 0),t([et()],he.prototype,"_config",void 0),t([et()],he.prototype,"_helpers",void 0),he=t([Q("opensprinkler-card-editor")],he);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de=nt(class extends st{constructor(t){var e;if(super(t),t.type!==it||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var i,n;if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.et=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(i=this.et)||void 0===i?void 0:i.has(t))&&this.st.add(t);return this.render(e)}const s=t.element.classList;this.st.forEach((t=>{t in e||(s.remove(t),this.st.delete(t))}));for(const t in e){const i=!!e[t];i===this.st.has(t)||(null===(n=this.et)||void 0===n?void 0:n.has(t))||(i?(s.add(t),this.st.add(t)):(s.remove(t),this.st.delete(t)))}return H}});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ue extends K{render(){if(!this.hass||!this.config)return N``;const t=this.secondaryText||this.config.secondary_info,e=this.config.title?"font-size: 1.1em":"",i=this.config.hide_dots;return N`
      <state-badge
        class=${de({pointer:i})}
        .hass=${this.hass}
        .overrideIcon=${this.config.icon}
        .overrideImage=${this.config.image}
        .stateColor=${this.config.state_color}
        .stateObj=${this.stateObj}
        @click=${this._handleClick}
        tabindex=${(t=>null!=t?t:T)(i?"0":void 0)}
      ></state-badge>
      <div
        class="info ${de({"text-content":!t})}"
      >
        <span style=${e}>${this.config.name}</span>
        ${t?N`<div class="secondary">${this.secondaryText}</div>`:""}
      </div>
      <slot></slot>
      ${this.config.hide_dots?"":N`<mwc-icon-button
        class="more-info"
        label="Open more info"
        @click=${this._handleClick}
        tabindex="0"
        style="margin-inline-end: -8px"
      >
        <ha-svg-icon .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"}></ha-svg-icon>
      </mwc-icon-button>`}
    `}updated(t){super.updated(t),t.has("hass")&&this.toggleAttribute("rtl",Tt(this.hass))}_handleClick(){Lt(this,"hass-more-info",{entityId:this.config.entity})}static get styles(){return r`
      :host {
        display: flex;
        align-items: center;
        flex-direction: row;
        --mdc-icon-button-size: 40px;
      }
      .info {
        margin-left: 16px;
        margin-right: 8px;
        flex: 1 1 30%;
      }
      .info,
      .info > * {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .flex ::slotted(*) {
        margin-left: 8px;
        min-width: 0;
      }
      .flex ::slotted([slot="secondary"]) {
        margin-left: 0;
      }
      .secondary,
      ha-relative-time {
        color: var(--secondary-text-color);
      }
      state-badge {
        flex: 0 0 40px;
      }
      :host([rtl]) .flex {
        margin-left: 0;
        margin-right: 16px;
      }
      :host([rtl]) .flex ::slotted(*) {
        margin-left: 0;
        margin-right: 8px;
      }
      .pointer {
        cursor: pointer;
      }
      .more-info {
        color: var(--secondary-text-color);
      }
    `}}t([tt({attribute:!1})],ue.prototype,"hass",void 0),t([tt()],ue.prototype,"stateObj",void 0),t([tt()],ue.prototype,"config",void 0),t([tt()],ue.prototype,"secondaryText",void 0),customElements.define("opensprinkler-generic-entity-row",ue);const pe=["waiting"],me=["program","once_program","manual","on"],ge=[...me,...pe],fe=t=>"station"===t.attributes.opensprinkler_type&&t.entity_id.startsWith("sensor."),ve=t=>"program"===t.attributes.opensprinkler_type&&t.entity_id.startsWith("binary_sensor."),_e=t=>"controller"===t.attributes.opensprinkler_type&&t.entity_id.startsWith("switch."),ye=t=>"run_once"===t.entity_id,be=t=>{var e;return!(null===(e=t.attributes)||void 0===e?void 0:e.opensprinkler_type)},$e=t=>t.entity_id.startsWith("switch."),we=t=>t.entity_id.startsWith("binary_sensor.")&&t.entity_id.endsWith("rain_delay_active"),xe=t=>t.entity_id.startsWith("sensor.")&&t.entity_id.endsWith("rain_delay_stop_time");function Se(t){return t(fe).some((t=>254===t.attributes.running_program_id))}const Ae=t=>pe.includes(t.state),ke=t=>ge.includes(t.state),Ee=t=>me.includes(t.state);function Ce(t){return t.attributes.name||t.attributes.friendly_name.replace(/ Station Status$/,"").replace(/ Program Running$/,"").replace(/^OpenSprinkler /,"")}function Me(t,e){var i;return"on"===(null===(i=e($e).find((e=>e.attributes.index==t.attributes.index&&e.attributes.opensprinkler_type==t.attributes.opensprinkler_type)))||void 0===i?void 0:i.state)}function De(t){return"small"===t?"32px":"medium"===t?"36px":void 0}class Oe extends HTMLElement{async connectedCallback(){const t=await window.loadCardHelpers();this.element=t.createRowElement(this._config),this.element.hass=this._hass,this.appendChild(this.element)}disconnectedCallback(){this.removeChild(this.element)}set hass(t){this._hass=t,this.element&&(this.element.hass=t)}set config(t){this._config=t,this.element&&this.element.setConfig(t)}}function Ne(t,e,i){let n;if(!t)return N`<hui-warning>Entity not found</hui-warning>`;if("string"==typeof t){const i=e.states[t];if(!i)return N`<hui-warning>Entity ${t} not found</hui-warning>`;n={entity:t,name:Ce(i)}}else n=t;return N`<opensprinkler-state .config=${n} .hass=${e} @hass-more-info=${i}></opensprinkler-state>`}window.customElements.define("opensprinkler-state",Oe);let He=class extends K{constructor(){super(...arguments),this._loading=!1,this._stopping=!1}updated(t){super.updated(t),t.has("hass")&&(this._loading=!1,this.entities(fe).every((t=>"idle"===t.state))&&(this._stopping=!1))}render(){if(!this.entity)return N`<hui-warning>Entity not found</hui-warning>`;const t=this._loading||this._stopping,e=this._enabled();if(void 0===e)return N`<hui-warning>Enable switch for entity not found</hui-warning>`;const i={entity:this.entity.entity_id,name:Ce(this.entity),icon:this._icon(e),hide_dots:this.config.hide_dots};return N`<opensprinkler-generic-entity-row .config=${i} .hass=${this.hass} .stateObj=${this.entity}>
      ${this._state(e)}
      ${t?N`<mwc-circular-progress indeterminate density="-4"></mwc-circular-progress>`:N`<mwc-icon-button label="Run station" class="button" @click=${()=>this._toggleEntity(this.entity)} .disabled=${!e}>
        <ha-svg-icon .path=${this._toggleIcon()}></ha-svg-icon>
      </mwc-icon-button>`}
    </opensprinkler-generic-entity-row>`}_state(t){return ye(this.entity)?"Running":fe(this.entity)?"idle"!==this.entity.state||t?"once_program"===this.entity.state?"Once Program":ne(this.hass,this.entity.state,this.entity):"Disabled":ve(this.entity)?"off"!==status||t?"on"===status?"Running":"Off":"Disabled":void 0}_icon(t){if(ye(this.entity))return this.config.icons.run_once;if(fe(this.entity)){const e=Ee(this.entity);return this._iconFromSet(e,t,this.config.icons.station)}if(ve(this.entity)){const e="on"===this.entity.state;return this._iconFromSet(e,t,this.config.icons.program)}}_iconFromSet(t,e,i){return t&&e?i.active:!t&&e?i.idle:t&&!e?i.active_disabled:t||e?void 0:i.idle_disabled}_toggleIcon(){return ke(this.entity)?"M18,18H6V6H18V18Z":"M8,5.14V19.14L19,12.14L8,5.14Z"}_enabled(){return!!ye(this.entity)||Me(this.entity,this.entities)}_toggleEntity(t){const e=ke(t)?"stop":"run";let i=t.entity_id;const n="stop"===e&&ve(t);"run_once"===i||n?(this._stopping=!0,i=this.entities(_e)[0].entity_id):this._loading=!0,"run"===e&&fe(t)?this.hass.callService("opensprinkler",e,{entity_id:i,run_seconds:this._runtime()}):this.hass.callService("opensprinkler",e,{entity_id:i})}_runtime(){var t;if(!(null===(t=this.config.input_number)||void 0===t?void 0:t.entity))return;const e=this.hass.states[this.config.input_number.entity];return e?60*Number(e.state):void 0}static get styles(){return r`
      opensprinkler-generic-entity-row { height: var(--opensprinkler-line-height); }

      .button {
        color: var(--secondary-text-color);
        --mdc-icon-button-size: 40px;
        margin-inline-end: -8px;
        margin-inline-start: 4px;
      }

      mwc-circular-progress {
        margin-inline-start: 8px;
        margin-inline-end: -4px;
      }
    `}};t([tt({attribute:!1})],He.prototype,"hass",void 0),t([tt({attribute:!1})],He.prototype,"entities",void 0),t([tt()],He.prototype,"controller",void 0),t([tt()],He.prototype,"entity",void 0),t([tt()],He.prototype,"config",void 0),t([et()],He.prototype,"_loading",void 0),t([et()],He.prototype,"_stopping",void 0),He=t([Q("opensprinkler-control")],He);const Te=r`
  /* prevent clipping of positioned elements */
  paper-dialog-scrollable {
    --paper-dialog-scrollable: {
      -webkit-overflow-scrolling: auto;
    }
  }

  /* force smooth scrolling for iOS 10 */
  paper-dialog-scrollable.can-scroll {
    --paper-dialog-scrollable: {
      -webkit-overflow-scrolling: touch;
    }
  }

  .paper-dialog-buttons {
    align-items: flex-end;
    padding: 8px;
    padding-bottom: max(env(safe-area-inset-bottom), 8px);
  }

  @media all and (min-width: 450px) and (min-height: 500px) {
    ha-paper-dialog {
      min-width: 400px;
    }
  }

  @media all and (max-width: 450px), all and (max-height: 500px) {
    paper-dialog,
    ha-paper-dialog {
      margin: 0;
      width: calc(
        100% - env(safe-area-inset-right) - env(safe-area-inset-left)
      ) !important;
      min-width: calc(
        100% - env(safe-area-inset-right) - env(safe-area-inset-left)
      ) !important;
      max-width: calc(
        100% - env(safe-area-inset-right) - env(safe-area-inset-left)
      ) !important;
      max-height: calc(100% - var(--header-height));

      position: fixed !important;
      bottom: 0px;
      left: env(safe-area-inset-left);
      right: env(safe-area-inset-right);
      overflow: scroll;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }

  /* mwc-dialog (ha-dialog) styles */
  ha-dialog {
    --mdc-dialog-min-width: 400px;
    --mdc-dialog-max-width: 600px;
    --mdc-dialog-heading-ink-color: var(--primary-text-color);
    --mdc-dialog-content-ink-color: var(--primary-text-color);
    --justify-action-buttons: space-between;
  }

  ha-dialog .form {
    padding-bottom: 24px;
    color: var(--primary-text-color);
  }

  a {
    color: var(--primary-color);
  }

  /* make dialog fullscreen on small screens */
  @media all and (max-width: 450px), all and (max-height: 500px) {
    ha-dialog {
      --mdc-dialog-min-width: calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );
      --mdc-dialog-max-width: calc(
        100vw - env(safe-area-inset-right) - env(safe-area-inset-left)
      );
      --mdc-dialog-min-height: 100%;
      --mdc-dialog-max-height: 100%;
      --mdc-shape-medium: 0px;
      --vertial-align-dialog: flex-end;
    }
  }
  mwc-button.warning {
    --mdc-theme-primary: var(--error-color);
  }
  .error {
    color: var(--error-color);
  }
`,Pe=r`
  ha-dialog {
    --dialog-surface-position: static;
    --dialog-content-position: static;
  }

  ha-header-bar {
    --mdc-theme-on-primary: var(--primary-text-color);
    --mdc-theme-primary: var(--mdc-theme-surface);
    flex-shrink: 0;
    display: block;
  }

  @media all and (max-width: 450px), all and (max-height: 500px) {
    ha-header-bar {
      --mdc-theme-primary: var(--app-header-background-color);
      --mdc-theme-on-primary: var(--app-header-text-color, white);
      border-bottom: none;
    }
  }

  .heading {
    border-bottom: 1px solid
      var(--mdc-dialog-scroll-divider-color, rgba(0, 0, 0, 0.12));
  }

  @media all and (min-width: 451px) and (min-height: 501px) {
    ha-dialog {
      --mdc-dialog-max-width: 90vw;
    }

    .content {
      width: 352px;
    }

    ha-header-bar {
      width: 400px;
    }

    .main-title {
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
    }

    :host([large]) .content {
      width: calc(90vw - 48px);
    }

    :host([large]) ha-dialog[data-domain="camera"] .content,
    :host([large]) ha-header-bar {
      width: 90vw;
    }
  }

  state-card-content,
  ha-more-info-history,
  ha-more-info-logbook:not(:last-child) {
    display: block;
    margin-bottom: 16px;
  }
`;let Re=class extends K{constructor(){super(...arguments),this.large=!1}showDialog(t){this._config=t.config,this._config?this.large=!1:this.closeDialog()}closeDialog(){this._config=void 0}render(){if(!this._config)return N``;const t=rt({"--opensprinkler-line-height":De(this._config.popup_line_height),direction:Tt(this.hass)?"rtl":void 0});return N`
      <ha-dialog
        open
        @closed=${this.closeDialog}
        .heading=${!0}
        hideActions
        data-domain=${"opensprinkler"}
        style=${t}
      >
        <div slot="heading" class="heading">
          <ha-header-bar>
            <mwc-icon-button
              slot="navigationIcon"
              dialogAction="cancel"
              .label=${this.hass.localize("ui.dialogs.more_info_control.dismiss")}
            >
              <ha-svg-icon .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}></ha-svg-icon>
            </mwc-icon-button>
            <div slot="title" class="main-title" @click=${this._enlarge}>
              ${this._config.name}
            </div>
          </ha-header-bar>
        </div>
        <div class="content">
          ${this._renderStates()}
          ${this._renderStations()}
          ${this._renderPrograms()}
        </div>
      </ha-dialog>
    `}_renderHeading(t){return N`<div role="heading" class="header">${t}</div>`}_renderState(t){return Ne(t.entity_id,this.hass,(t=>this._moreInfo(t)))}_renderControl(t){return N`<opensprinkler-control .entity=${t}
                   .entities=${this.entities} .hass=${this.hass}
                   .config=${this._config}
                   @hass-more-info=${this._moreInfo}
                ></opensprinkler-control>`}_renderStates(){return this.entities(_e).map((t=>this._renderState(t))).concat(this.entities(be).sort(((t,e)=>t.entity_id.includes("sensor_")||t.entity_id.includes("rain_delay")&&!e.entity_id.includes("sensor_")?1:-1)).map((t=>this._renderState(t))))}_renderStations(){return[this._renderHeading("Stations"),this._config.input_number?Ne(this._config.input_number,this.hass):""].concat(this.entities(fe).filter((t=>this._shouldShowEntity(t))).map((t=>this._renderControl(t))))}_renderPrograms(){return[this._renderHeading("Programs"),Se(this.entities)?this._renderControl({entity_id:"run_once",state:"on",attributes:{name:"Run Once"}}):N``].concat(this.entities(ve).filter((t=>this._shouldShowEntity(t))).map((t=>this._renderControl(t))))}_enlarge(){this.large=!this.large}_moreInfo(t){this.closeDialog(),Lt(this.parent,"hass-more-info",t.detail)}_shouldShowEntity(t){return!this._config.hide_disabled||Me(t,this.entities)}static get styles(){return[Te,Pe,ce]}};t([tt({attribute:!1})],Re.prototype,"hass",void 0),t([tt({attribute:!1})],Re.prototype,"entities",void 0),t([tt({attribute:!1})],Re.prototype,"parent",void 0),t([tt({type:Boolean,reflect:!0})],Re.prototype,"large",void 0),t([et()],Re.prototype,"_config",void 0),Re=t([Q("opensprinkler-more-info-dialog")],Re);var Ue=function(){return(Ue=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var s in e=arguments[i])Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t}).apply(this,arguments)};var je,Le,Ie={second:45,minute:45,hour:22,day:5};!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(je||(je={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Le||(Le={}));const Ye=(t,e,i,n=!0)=>{const s=function(t,e,i){void 0===e&&(e=Date.now()),void 0===i&&(i={});var n=Ue(Ue({},Ie),i||{}),s=(+t-+e)/1e3;if(Math.abs(s)<n.second)return{value:Math.round(s),unit:"second"};var r=s/60;if(Math.abs(r)<n.minute)return{value:Math.round(r),unit:"minute"};var o=s/3600;if(Math.abs(o)<n.hour)return{value:Math.round(o),unit:"hour"};var a=s/86400;if(Math.abs(a)<n.day)return{value:Math.round(a),unit:"day"};var l=new Date(t),c=new Date(e),h=l.getFullYear()-c.getFullYear();if(Math.round(Math.abs(h))>0)return{value:Math.round(h),unit:"year"};var d=12*h+l.getMonth()-c.getMonth();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"month"};var u=s/604800;return{value:Math.round(u),unit:"week"}}(t,i);return n?(t=>new Intl.RelativeTimeFormat(t.language,{numeric:"auto"}))(e).format(s.value,s.unit):Intl.NumberFormat(e.language,{style:"unit",unit:s.unit,unitDisplay:"long"}).format(Math.abs(s.value))};window.customCards=window.customCards||[],window.customCards.push({type:"opensprinkler-card",name:"Opensprinkler Card",description:"Collect OpenSprinkler status into a card"}),window.customElements.define("opensprinkler-timer-bar-entity-row",se);let ze=class extends K{static async getConfigElement(){return document.createElement("opensprinkler-card-editor")}static getStubConfig(){return{}}setConfig(t){var e,i;if(!t)throw new Error("Invalid configuration");this.config=Object.assign(Object.assign({name:"Sprinkler",icon:"mdi:sprinkler-variant",card_line_height:"small",timer_line_height:"medium",popup_line_height:"small"},t),{icons:Object.assign(Object.assign({run_once:"mdi:auto-fix"},t.icons),{station:Object.assign({active:"mdi:water",active_disabled:"mdi:water-off",idle:"mdi:water-outline",idle_disabled:"mdi:water-off-outline"},null===(e=t.icons)||void 0===e?void 0:e.station),program:Object.assign({active:"mdi:timer",active_disabled:"mdi:timer-off",idle:"mdi:timer-outline",idle_disabled:"mdi:timer-off-outline"},null===(i=t.icons)||void 0===i?void 0:i.station)})})}render(){var t;if(!this.config.device)return N`<hui-warning>No device specified</hui-warning>`;if(this.config.input_number&&!this.config.input_number.entity)return N`<hui-warning>input_number.entity must be defined</hui-warning>`;if(!this.entities)return N``;const e={name:this.config.name,icon:this.config.icon,title:!0},i=this._statusEntities(),n=rt({"--opensprinkler-line-height":De(this.config.card_line_height),"--opensprinkler-timer-height":De(this.config.timer_line_height)});return N`<ha-card style=${n}>
      <div class="card-content">
        <opensprinkler-generic-entity-row
          .hass=${this.hass} .config=${e}
          .secondaryText=${this._secondaryText()}
          @hass-more-info=${this._moreInfo}
        ></opensprinkler-generic-entity-row>
        <div .style=${i.length?"margin-top: 12px":""}>
          ${i.map((t=>this._renderStatus(t)))}
        </div>
          ${this.config.card_stations?N`<hui-warning>card_stations has been renamed to extra_entities</hui-warning>`:""}
          ${(null===(t=this.config.extra_entities)||void 0===t?void 0:t.length)?N`<div class="extras">
          ${this.config.input_number?Ne(this.config.input_number,this.hass):""}
          ${this._renderExtraEntities()}
        </div>`:""}
      </div>
    </ha-card>
    `}_moreInfo(){this.dialog.showDialog({config:this.config})}shouldUpdate(t){var e,i;if(!this.config)return!1;if(t.has("config"))return!0;const n=t.get("hass");if(!n)return!0;for(const t of this._matchingEntities((()=>!0)))if(n.states[t.entity_id]!==t)return!0;const s=null===(e=this.config.input_number)||void 0===e?void 0:e.entity;return!(!s||n.states[s]===(null===(i=this.hass)||void 0===i?void 0:i.states[s]))}connectedCallback(){super.connectedCallback(),this.hass&&this._subscribe(),this.dialog=new Re,this.dialog.hass=this.hass,this.dialog.entities=this._matchingEntities.bind(this),this.dialog.parent=this,document.body.appendChild(this.dialog)}updated(t){super.updated(t),!this.unsub&&t.has("hass")&&this._subscribe(),t.has("hass")&&(this.dialog.hass=this.hass)}disconnectedCallback(){super.disconnectedCallback(),this.unsub&&this.unsub(),this.unsub=void 0,document.body.removeChild(this.dialog)}_subscribe(){var t;this.unsub=(t=this.hass.connection,oe("_entityRegistry",ae,le,t,(t=>{this.entities=t})))}_matchingEntities(t){if(!this.entities||!this.hass)return[];return this.entities.filter((e=>{const i=this.hass.states[e.entity_id];if(i)return e.device_id===this.config.device&&t(i)})).map((t=>this.hass.states[t.entity_id]))}_statusEntities(){const t=this._matchingEntities(fe);return t.filter(Ee).concat(t.filter(Ae))}_renderStatus(t){const e=function(t){return Object.assign(Object.assign({active_state:["active","on","manual","program","once_program"],pause_state:"paused",waiting_state:"waiting",guess_mode:!1,end_time:{attribute:"end_time"},start_time:{attribute:"start_time"},duration:{attribute:"duration"},bar_width:"calc(70% - 7em)",bar_height:"8px",text_width:"3.5em",bar_background:"#eee",bar_foreground:"var(--mdc-theme-primary, #6200ee);"},t),{translations:Object.assign({scheduled_for:"Scheduled for",once_program:"Once Program",program:"Program",manual:"Manual",waiting:"Waiting"},t.translations)})}(Object.assign(Object.assign({icon:this.config.icons.station.idle,active_icon:this.config.icons.station.active},this.config.bars),{type:"timer-bar-entity-row",entity:t.entity_id,name:t.attributes.name}));return N`<opensprinkler-timer-bar-entity-row
      .config=${e} .hass=${this.hass}>
    </opensprinkler-timer-bar-entity-row>`}_renderExtraEntities(){return this.config.extra_entities?this.config.extra_entities.map((t=>{return t.includes(".")?this.hass.states[t]?(e=this.hass.states[t],fe(e)||ve(e)||ye(e)?N`<opensprinkler-control .entity=${this.hass.states[t]}
                   .entities=${t=>this._matchingEntities(t)} .hass=${this.hass}
                   .config=${this.config}
                ></opensprinkler-control>`:Ne(t,this.hass)):N`<hui-warning>Entity ${t} not found</hui-warning>`:N`<div role="heading" class="header">${t}</div>`;var e})):""}_secondaryText(){var t;const e=t=>this._matchingEntities(t);if(function(t){return t(we).some((t=>"on"===t.state))}(e)){const i=null===(t=e(xe).find((t=>!0)))||void 0===t?void 0:t.state;return"Rain delay"+(i?` ends ${Ye(new Date(i),this.hass.locale)}`:"")}const i=e(ve).filter(Ee).map(Ce);return Se(e)&&i.splice(0,0,"Once Program"),function(t){return t(fe).some((t=>99===t.attributes.running_program_id))}(e)&&i.push("Stations Manually"),i.length>0?"Running "+i.join(", "):""}async getCardSize(){return 1+this._statusEntities().length}};ze.styles=[ce,r`.header { margin-top: 8px; }`],t([tt({attribute:!1})],ze.prototype,"hass",void 0),t([et()],ze.prototype,"config",void 0),t([et()],ze.prototype,"entities",void 0),t([et()],ze.prototype,"unsub",void 0),t([et()],ze.prototype,"dialog",void 0),ze=t([Q("opensprinkler-card")],ze);export{ze as OpensprinklerCard};
