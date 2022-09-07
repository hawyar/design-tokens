"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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
  OutputFormat: () => OutputFormat,
  parse: () => parse
});
module.exports = __toCommonJS(parser_exports);
var import_promises = require("fs/promises");
var import_tinycolor2 = __toESM(require("tinycolor2"));
var import_no_case = require("no-case");
var OutputFormat = /* @__PURE__ */ ((OutputFormat2) => {
  OutputFormat2[OutputFormat2["CSS"] = 0] = "CSS";
  OutputFormat2[OutputFormat2["SCSS"] = 1] = "SCSS";
  return OutputFormat2;
})(OutputFormat || {});
var TSystemColors = /* @__PURE__ */ ((TSystemColors2) => {
  TSystemColors2["Canvas"] = "Canvas";
  TSystemColors2["CanvasText"] = "CanvasText";
  TSystemColors2["LinkText"] = "LinkText";
  TSystemColors2["VisitedText"] = "VisitedText";
  TSystemColors2["ActiveText"] = "ActiveText";
  TSystemColors2["ButtonFace"] = "ButtonFace";
  TSystemColors2["ButtonText"] = "ButtonText";
  TSystemColors2["ButtonBorder"] = "ButtonBorder";
  TSystemColors2["Field"] = "Field";
  TSystemColors2["FieldText"] = "FieldText";
  TSystemColors2["Highlight"] = "Highlight";
  TSystemColors2["HighlightText"] = "HighlightText";
  TSystemColors2["SelectedItem"] = "SelectedItem";
  TSystemColors2["SelectedItemText"] = "SelectedItemText";
  TSystemColors2["Mark"] = "Mark";
  TSystemColors2["MarkText"] = "MarkText";
  TSystemColors2["GrayText"] = "GrayText";
  TSystemColors2["AccentColor"] = "AccentColor";
  TSystemColors2["AccentColorText"] = "AccentColorText";
  return TSystemColors2;
})(TSystemColors || {});
class Token {
  constructor(t) {
    this.token = __spreadValues({}, t);
  }
  getToken() {
    return this.token;
  }
  normalizeName() {
    this.token.normalizedName = (0, import_no_case.noCase)(this.token.path, { delimiter: "-" });
  }
  toCSS() {
    this.normalizeName();
    switch (this.token.type) {
      case "color":
        if (this.token.value === "transparent") {
          this.token.css = `--${this.token.normalizedName}: rgb(0, 0, 0, 0);`;
          return;
        }
        this.token.css = `--${this.token.normalizedName}: ${this.token.computedValue};`;
        break;
      default:
        break;
    }
  }
}
class Parser {
  constructor(source, opt) {
    this.source = source;
    this.opt = opt;
    this.tokens = this.readTokens(this.source);
    this._paths = [];
    this._tmp = [];
  }
  readTokens(source) {
    var _a;
    if (this._paths === void 0)
      this._paths = [];
    if (this._tmp === void 0)
      this._tmp = [];
    if (this.tokens === void 0)
      this.tokens = [];
    for (const [k, v] of Object.entries(source)) {
      if (v.hasOwnProperty("$value") && v.hasOwnProperty("$type")) {
        this._paths = [...this._tmp, k];
        const t = {
          value: v.$value,
          name: k,
          type: (_a = v.$type) != null ? _a : typeof v.$value,
          path: this._paths.join("/"),
          isComposite: typeof v.$value === "object"
        };
        if (typeof v["$value"] === "object") {
          t.isComposite = true;
        }
        const tt = new Token(t);
        if (v.hasOwnProperty("$description")) {
          tt.token.description = v.$description;
        }
        if (v.hasOwnProperty("$extensions")) {
          tt.token.extensions = v.$extensions;
        }
        this.computeValue(tt.getToken());
        tt.toCSS();
        this.tokens.push(tt.getToken());
        this._paths = [];
      } else {
        this._tmp.push(k);
        this.readTokens(v);
      }
    }
    return this.tokens;
  }
  computeValue(t) {
    switch (t.type) {
      case "color":
        if (t.value === "transparent") {
          t.computedValue = (0, import_tinycolor2.default)("#ffffff").setAlpha(0).toRgbString();
          return;
        }
        const raw = (0, import_tinycolor2.default)(t.value);
        if (!raw.isValid())
          throw new Error(`TColor: Invalid color: ${t.value}`);
        if (typeof t.value === "string" && !t.value.startsWith("#")) {
          t.computedValue = raw.toString("name");
          return;
        }
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
          const { r, g, b, a } = (0, import_tinycolor2.default)(t.value).toPercentageRgb();
          t.computedValue = `rgba(${r}, ${g}, ${b}, ${a})`;
          return;
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
  wrapCSSInRoot() {
    return `:root { ${this.tokens.map((t) => t.css).join("\n")} }`;
  }
}
function parse(_0) {
  return __async(this, arguments, function* (source, opt = { colorFormat: "rgb", outputFormat: 0 /* CSS */ }) {
    if (source === void 0) {
      throw new Error("Source is undefined");
    }
    if (typeof source === "string" && source.startsWith("{")) {
      source = JSON.parse(source);
    }
    if (typeof source === "string" && (source.endsWith(".tokens") || source.endsWith(".tokens.json"))) {
      source = yield (0, import_promises.readFile)(source, { encoding: "utf8" });
    }
    const p = new Parser(source, opt);
    return {
      tokens: p.tokens,
      css: p.wrapCSSInRoot()
    };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OutputFormat,
  parse
});
