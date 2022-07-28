"use strict";var k=Object.create;var r=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var p=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty;var y=(e,t)=>{for(var s in t)r(e,s,{get:t[s],enumerable:!0})},a=(e,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of T(t))!h.call(e,n)&&n!==s&&r(e,n,{get:()=>t[n],enumerable:!(o=u(t,n))||o.enumerable});return e};var l=(e,t,s)=>(s=e!=null?k(p(e)):{},a(t||!e||!e.__esModule?r(s,"default",{value:e,enumerable:!0}):s,e)),f=e=>a(r({},"__esModule",{value:!0}),e);var $={};y($,{parse:()=>d});module.exports=f($);var c=l(require("fs"));class g{constructor(t){this.token=t}toString(){return JSON.stringify(this.token,null,2)}getToken(){return this.token}getType(){return this.token.type}toCSS(){switch(this.token.type){case"color":const t=typeof this.token.value=="string"?this.token.value:this.token.value.$value;this.token.css=`"${this.token.name.trim()}": ${t};`;break;case"fontFamily":const s=this.token.value;this.token.css=Array.isArray(s)?s.map(o=>`"${o}"`).join(", "):`"${s}";`;break;case"shadow":this.token.css=`box-shadow: "${this.token.value}";`;break;default:throw new Error(`Unsupported token type: ${this.token.type}`)}}}class m{constructor(t){this.opt=t,this.tokens=[]}readTokens(){var t,s;for(const[o,n]of Object.entries(this.opt.source)){if(n.$value!==void 0){const i=new g({name:o,type:(t=n.$type)!=null?t:typeof n.$value,value:n,description:(s=n.$description)!=null?s:"",path:o,css:""});this.opt.format==="css"&&i.toCSS(),this.tokens.push(i.getToken());continue}console.log("has nested tokens")}return this.tokens}}function d(e){if(e===void 0)throw new Error("Parser options are required");if(e.format!=="css")throw new Error("Unsupported format");return typeof e.source=="string"&&(e.source.startsWith("./")||e.source.startsWith("/"))&&(e.source=c.default.readFileSync(e.source,"utf8")),typeof e.source=="string"&&(e.source=JSON.parse(e.source)),{tokens:new m(e).readTokens()}}0&&(module.exports={parse});