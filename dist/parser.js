"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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
var import_no_case = require("no-case");
const fontWeights = {
  THIN: 100,
  HAIR: 100,
  EXTRA_LIGHT: 200,
  ULTRA_LIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  REGULAR: 400,
  BOOK: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  DEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  ULTRA_BOLD: 800,
  BLACK: 900,
  HEAVY: 900,
  EXTRA_BLACK: 950,
  ULTRA_BLACK: 950
};
class Token {
  constructor(t) {
    this.token = __spreadProps(__spreadValues({}, t), {
      type: t.type || null
    });
    this.normalizeName();
  }
  prettyPrint() {
    console.log(JSON.stringify(this.token, null, 2));
  }
  getToken() {
    return this.token;
  }
  normalizeName() {
    this.token.normalizedName = (0, import_no_case.noCase)(this.token.name, { delimiter: "-" });
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
        this.computeValue(tt.getToken());
        tt.prettyPrint();
        this.tokens.push(tt.getToken());
      } else {
        this._paths.push(k);
        this.readTokens(v);
      }
    }
    return this.tokens;
  }
  computeValue(t) {
    switch (t.type) {
      case "color":
        const raw = (0, import_tinycolor2.default)(t.value);
        if (!raw.isValid())
          throw new Error(`TColor: Invalid color: ${t.value}`);
        if (raw.getFormat() !== "hex")
          throw new Error("TColor: The value MUST be a string containing a hex triplet/quartet including the preceding # character");
        if (this.opt.colorFormat === "rgb") {
          t.computedValue = raw.toRgbString();
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
        }
        break;
      case "dimension":
        const unit = t.value.toString().replace(/[0-9.]/g, "");
        if (unit === "px" || unit === "rem") {
          t.computedValue = parseFloat(t.value.toString().replace(/[a-z]/g, ""));
          return;
        }
        throw new Error('The value must be a string containing a number (either integer or floating-point) followed by either a "px" or "rem" unit (future spec iterations may add support for additional units)');
      case "fontFamily":
        t.computedValue = Array.isArray(t.value) ? t.value : [t.value];
        break;
      case "fontWeight":
        if (typeof t.value === "number") {
          if (t.value < 1 || t.value > 1e3)
            throw new Error("The value must be a number between 1 and 1000");
          t.computedValue = t.value;
          return;
        }
      case "duration":
        const durationUnit = t.value.toString().replace(/[0-9.]/g, "");
        t.computedValue = {
          unit: durationUnit,
          value: t.value.toString().replace(/[a-z]/g, "")
        };
        break;
      case "cubicBezier":
        if (!Array.isArray(t.value))
          throw new Error("The value must be an array of 4 numbers");
        for (const v of t.value) {
          if (typeof v !== "number")
            throw new Error("The value must be an array of 4 numbers");
        }
        const [P1x, P1y, P2x, P2y] = t.value;
        if (P1x < 0 || P1x > 1)
          throw new Error("x coordinate of P1 must be between 0 and 1");
        if (P2x < 0 || P2x > 1)
          throw new Error("x coordinate of P2 must be between 0 and 1");
        if (P1y < -Infinity || P1y > Infinity)
          throw new Error("y coordinate of P1 must be between -Inf and Inf");
        if (P2y < -Infinity || P2y > Infinity)
          throw new Error("y coordinate of P2 must be between -Inf and Inf");
        t.computedValue = t.value;
        break;
      default:
        throw new Error("not implemented yet");
    }
  }
}
function parse(_0) {
  return __async(this, arguments, function* (source, opt = { colorFormat: "rgb" }) {
    if (source === void 0) {
      throw new Error("source is undefined");
    }
    if (typeof source === "string" && (source.endsWith(".tokens") || source.endsWith(".tokens.json"))) {
      source = yield (0, import_promises.readFile)(source, { encoding: "utf8" });
    }
    const p = new Parser(source, opt);
    return { tokens: p.tokens };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parse
});
