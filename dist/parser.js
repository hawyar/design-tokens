"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
  getType() {
    return this.token.type;
  }
  toCSS() {
    switch (this.token.type) {
      case "color":
        const val = typeof this.token.value === "string" ? this.token.value : this.token.value["$value"];
        this.token.css = `"${this.token.name.trim()}": ${val};`;
        break;
      case "fontFamily":
        const t = this.token.value;
        this.token.css = Array.isArray(t) ? t.map((x) => `"${x}"`).join(", ") : `"${t}";`;
        break;
      case "shadow":
        this.token.css = `box-shadow: "${this.token.value}";`;
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
  }
  readTokens(source) {
    if (this.tokens === void 0) {
      this.tokens = [];
    }
    for (const [k, v] of Object.entries(source)) {
      if (v["$value"] !== void 0 && v["$value"] !== null) {
        const tt = new Token({ value: v["$value"], name: k });
        if (v["$type"] !== void 0) {
          tt.token.type = v["$type"];
        }
        if (v["$description"] !== void 0) {
          tt.token.description = v["$description"];
        }
        if (v["$extensions"] !== void 0) {
          tt.token.extensions = v["$extensions"];
        }
        if (this.opt.format === "css" && tt.getType() !== void 0) {
          tt.toCSS();
        }
        this.tokens.push(tt.getToken());
      } else {
        this.readTokens(v);
      }
    }
    return this.tokens;
  }
}
function parse(source, opt) {
  return __async(this, null, function* () {
    if (source === void 0) {
      throw new Error("source is undefined");
    }
    if (opt.format !== "css") {
      throw new Error("unsupported format");
    }
    if (typeof source === "string" && (source.startsWith("./") || source.startsWith("/"))) {
      source = yield (0, import_promises.readFile)(source, { encoding: "utf8" });
    }
    const { tokens } = new Parser(source, opt);
    return { tokens };
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parse
});
