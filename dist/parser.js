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
var TOrderType = /* @__PURE__ */ ((TOrderType2) => {
  TOrderType2["GRAMMAR"] = "per grammar";
  return TOrderType2;
})(TOrderType || {});
var FontWeightNumericWithAlias = /* @__PURE__ */ ((FontWeightNumericWithAlias2) => {
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["HAIRLINE"] = 100] = "HAIRLINE";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["THIN"] = 100] = "THIN";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["EXTRA_LIGHT"] = 200] = "EXTRA_LIGHT";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["ULTRA_LIGHT"] = 200] = "ULTRA_LIGHT";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["LIGHT"] = 300] = "LIGHT";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["NORMAL"] = 400] = "NORMAL";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["REGULAR"] = 400] = "REGULAR";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["BOOK"] = 400] = "BOOK";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["MEDIUM"] = 500] = "MEDIUM";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["SEMI_BOLD"] = 600] = "SEMI_BOLD";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["DEMI_BOLD"] = 600] = "DEMI_BOLD";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["BOLD"] = 700] = "BOLD";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["EXTRA_BOLD"] = 800] = "EXTRA_BOLD";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["ULTRA_BOLD"] = 800] = "ULTRA_BOLD";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["BLACK"] = 900] = "BLACK";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["HEAVY"] = 900] = "HEAVY";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["EXTRA_BLACK"] = 950] = "EXTRA_BLACK";
  FontWeightNumericWithAlias2[FontWeightNumericWithAlias2["ULTRA_BLACK"] = 950] = "ULTRA_BLACK";
  return FontWeightNumericWithAlias2;
})(FontWeightNumericWithAlias || {});
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
var TNamedColors = /* @__PURE__ */ ((TNamedColors2) => {
  TNamedColors2["ALICE_BLUE"] = "aliceblue";
  TNamedColors2["ANTIQUE_WHITE"] = "antiquewhite";
  TNamedColors2["aqua"] = "aqua";
  TNamedColors2["aquamarine"] = "aquamarine";
  TNamedColors2["azure"] = "azure";
  TNamedColors2["beige"] = "beige";
  TNamedColors2["bisque"] = "bisque";
  TNamedColors2["black"] = "black";
  TNamedColors2["blanchedAlmond"] = "blanchedalmond";
  TNamedColors2["blue"] = "blue";
  TNamedColors2["blueViolet"] = "blueviolet";
  TNamedColors2["brown"] = "brown";
  TNamedColors2["burlyWood"] = "burlywood";
  TNamedColors2["cadetBlue"] = "cadetblue";
  TNamedColors2["chartreuse"] = "chartreuse";
  TNamedColors2["chocolate"] = "chocolate";
  TNamedColors2["coral"] = "coral";
  TNamedColors2["cornflowerBlue"] = "cornflowerblue";
  TNamedColors2["cornsilk"] = "cornsilk";
  TNamedColors2["crimson"] = "crimson";
  TNamedColors2["cyan"] = "cyan";
  TNamedColors2["darkBlue"] = "darkblue";
  TNamedColors2["darkCyan"] = "darkcyan";
  TNamedColors2["darkGoldenRod"] = "darkgoldenrod";
  TNamedColors2["darkGray"] = "darkgray";
  TNamedColors2["darkGreen"] = "darkgreen";
  TNamedColors2["darkGrey"] = "darkgrey";
  TNamedColors2["darkKhaki"] = "darkkhaki";
  TNamedColors2["darkMagenta"] = "darkmagenta";
  TNamedColors2["darkOliveGreen"] = "darkolivegreen";
  TNamedColors2["darkOrange"] = "darkorange";
  TNamedColors2["darkOrchid"] = "darkorchid";
  TNamedColors2["darkRed"] = "darkred";
  TNamedColors2["darkSalmon"] = "darksalmon";
  TNamedColors2["darkSeaGreen"] = "darkseagreen";
  TNamedColors2["darkSlateBlue"] = "darkslateblue";
  TNamedColors2["darkSlateGray"] = "darkslategrey";
  TNamedColors2["darkSlateGrey"] = "darkslategrey";
  TNamedColors2["darkTurquoise"] = "darkturquoise";
  TNamedColors2["darkViolet"] = "darkviolet";
  TNamedColors2["deepPink"] = "deeppink";
  TNamedColors2["deepSkyBlue"] = "deepskyblue";
  TNamedColors2["dimGray"] = "dimgray";
  TNamedColors2["dimGrey"] = "dimgrey";
  TNamedColors2["dodgerBlue"] = "dodgerblue";
  TNamedColors2["fireBrick"] = "firebrick";
  TNamedColors2["floralWhite"] = "floralwhite";
  TNamedColors2["forestGreen"] = "forestgreen";
  TNamedColors2["fuchsia"] = "fuchsia";
  TNamedColors2["gainsboro"] = "gainsboro";
  TNamedColors2["ghostWhite"] = "ghostwhite";
  TNamedColors2["gold"] = "gold";
  TNamedColors2["goldenRod"] = "goldenrod";
  TNamedColors2["gray"] = "gray";
  TNamedColors2["green"] = "green";
  TNamedColors2["greenYellow"] = "greenyellow";
  TNamedColors2["grey"] = "grey";
  TNamedColors2["honeyDew"] = "honeydew";
  TNamedColors2["hotPink"] = "hotpink";
  TNamedColors2["indianRed"] = "indianred";
  TNamedColors2["indigo"] = "indigo";
  TNamedColors2["ivory"] = "ivory";
  TNamedColors2["khaki"] = "khaki";
  TNamedColors2["lavender"] = "lavender";
  TNamedColors2["lavenderBlush"] = "lavenderblush";
  TNamedColors2["lawnGreen"] = "lawngreen";
  TNamedColors2["lemonChiffon"] = "lemonchiffon";
  TNamedColors2["lightBlue"] = "lightblue";
  TNamedColors2["lightCoral"] = "lightcoral";
  TNamedColors2["lightCyan"] = "lightcyan";
  TNamedColors2["lightGoldenRodYellow"] = "lightgoldenrodyellow";
  TNamedColors2["lightGray"] = "lightgray";
  TNamedColors2["lightGreen"] = "lightgreen";
  TNamedColors2["lightGrey"] = "lightgrey";
  TNamedColors2["lightPink"] = "lightpink";
  TNamedColors2["lightSalmon"] = "lightsalmon";
  TNamedColors2["lightSeaGreen"] = "lightseagreen";
  TNamedColors2["lightSkyBlue"] = "lightskyblue";
  TNamedColors2["lightSlateGray"] = "lightslategrey";
  TNamedColors2["lightSlateGrey"] = "lightslategrey";
  TNamedColors2["lightSteelBlue"] = "lightsteelblue";
  TNamedColors2["lightYellow"] = "lightyellow";
  TNamedColors2["lime"] = "lime";
  TNamedColors2["limeGreen"] = "limegreen";
  TNamedColors2["linen"] = "linen";
  TNamedColors2["magenta"] = "magenta";
  TNamedColors2["maroon"] = "maroon";
  TNamedColors2["mediumAquaMarine"] = "mediumaquamarine";
  TNamedColors2["mediumBlue"] = "mediumblue";
  TNamedColors2["mediumOrchid"] = "mediumorchid";
  TNamedColors2["mediumPurple"] = "mediumpurple";
  TNamedColors2["mediumSeaGreen"] = "mediumseagreen";
  TNamedColors2["mediumSlateBlue"] = "mediumslateblue";
  TNamedColors2["mediumSpringGreen"] = "mediumspringgreen";
  TNamedColors2["mediumTurquoise"] = "mediumturquoise";
  TNamedColors2["mediumVioletRed"] = "mediumvioletred";
  TNamedColors2["midnightBlue"] = "midnightblue";
  TNamedColors2["mintCream"] = "mintcream";
  TNamedColors2["mistyRose"] = "mistyrose";
  TNamedColors2["moccasin"] = "moccasin";
  TNamedColors2["navajoWhite"] = "navajowhite";
  TNamedColors2["navy"] = "navy";
  TNamedColors2["oldLace"] = "oldlace";
  TNamedColors2["olive"] = "olive";
  TNamedColors2["oliveDrab"] = "olivedrab";
  return TNamedColors2;
})(TNamedColors || {});
class Token {
  constructor(t) {
    this.token = t;
    this.props = null;
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
  detectType() {
    switch (this.token.type) {
      case "color":
        const raw = (0, import_tinycolor2.default)(this.token.value);
        if (!raw.isValid())
          throw new Error(`Invalid color: ${this.token.value}`);
        if (raw.getFormat() !== "hex")
          throw new Error("The value MUST be a string containing a hex triplet/quartet including the preceding # character");
        const cc = {
          name: "color"
        };
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
    if (typeof this._paths === "undefined")
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
        console.log(tt);
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
    if (opt !== void 0 && opt.format !== "css") {
      throw new Error("unsupported format");
    }
    if (typeof source === "string" && (source.endsWith(".tokens") || source.endsWith(".tokens.json"))) {
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
