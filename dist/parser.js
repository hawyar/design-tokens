"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var parser_exports = {};
__export(parser_exports, {
  parse: () => parse
});
module.exports = __toCommonJS(parser_exports);
var import_promises = require("fs/promises");
var import_tinycolor2 = __toESM(require("tinycolor2"));
class Token {
  constructor(t) {
    this.token = t;
  }
  toString() {
    return JSON.stringify(this.token, null, 2);
  }
  getToken() {
    return this.token;
  }
  detectType() {
    switch (this.token.type) {
      case "color":
        const raw = (0, import_tinycolor2.default)(this.token.value);
        if (!raw.isValid())
          throw new Error(`Invalid color: ${this.token.value}`);
        if (raw.getFormat() !== "hex")
          throw new Error("The value MUST be a string containing a hex triplet/quartet including the preceding # character");
        break;
      default:
        throw new Error(`Unsupported token type: ${this.token.type}`);
    }
  }
}
class Parser {
  constructor(source, opt) {
    this.source = source;
    this.opt = opt;
    this.tokens = this.readTokens(this.source);
    this._paths = [];
  }
  readTokens(source) {
    var _a;
    if (this._paths === void 0)
      this._paths = [];
    if (this.tokens === void 0)
      this.tokens = [];
    for (const [k, v] of Object.entries(source)) {
      if (v.hasOwnProperty("$value") && v.hasOwnProperty("$type")) {
        this._paths.push(k);
        const tt = new Token({ value: v.$value, name: k, type: (_a = v.$type) != null ? _a : typeof v.$value, path: this._paths.join("/") });
        if (v.hasOwnProperty("$description")) {
          tt.token.description = v.$description;
        }
        if (v.hasOwnProperty("$extensions")) {
          tt.token.extensions = v.$extensions;
        }
        tt.detectType();
        this.tokens.push(tt.getToken());
      } else {
        this.readTokens(v);
      }
    }
    return this.tokens;
  }
  computeValues() {
    for (const t of this.tokens) {
      switch (t.type) {
        case "color":
          console.log(this.opt.colorFormat);
          if (this.opt.colorFormat === "rgb") {
            t.computedValue = (0, import_tinycolor2.default)(t.value).toRgbString();
            return;
          }
          if (this.opt.colorFormat === "hex") {
            t.computedValue = (0, import_tinycolor2.default)(t.value).toHexString();
            return;
          }
          if (this.opt.colorFormat === "hsl") {
            t.computedValue = (0, import_tinycolor2.default)(t.value).toHslString();
            return;
          }
          if (this.opt.colorFormat === "rgba") {
            t.computedValue = (0, import_tinycolor2.default)(t.value).toPercentageRgb();
            return;
          }
          break;
        default:
          break;
      }
    }
  }
}
function parse(source, opt) {
  return __async(this, null, function* () {
    if (source === void 0) {
      throw new Error("source is undefined");
    }
    if (typeof source === "string" && (source.endsWith(".tokens") || source.endsWith(".tokens.json"))) {
      source = yield (0, import_promises.readFile)(source, { encoding: "utf8" });
    }
    if (opt.colorFormat === void 0) {
      opt.colorFormat = "rgb";
    }
    const p = new Parser(source, opt);
    p.computeValues();
    console.log(p.tokens);
    return { tokens: p.tokens };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parse
});
