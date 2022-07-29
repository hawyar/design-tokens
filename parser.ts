import { readFile } from 'fs/promises'
import tinycolor from 'tinycolor2'

type TNone = 'none'
type TTransparent = 'transparent'
type TCurrentColor = 'currentcolor'

type TDimension = `${string}px` | `${string}rem`
type TFontFamily = string | string[]
type TFontWeight = string
type TDuration = `${string}ms`
type TCubicBezier = Array<number>

enum TOrderType {
  GRAMMAR = 'per grammar'
}

enum TSystemColors {
  Canvas = 'Canvas',
  CanvasText = 'CanvasText',
  LinkText = 'LinkText',
  VisitedText = 'VisitedText',
  ActiveText = 'ActiveText',
  ButtonFace = 'ButtonFace',
  ButtonText = 'ButtonText',
  ButtonBorder = 'ButtonBorder',
  Field = 'Field',
  FieldText = 'FieldText',
  Highlight = 'Highlight',
  HighlightText = 'HighlightText',
  SelectedItem = 'SelectedItem',
  SelectedItemText = 'SelectedItemText',
  Mark = 'Mark',
  MarkText = 'MarkText',
  GrayText = 'GrayText',
  AccentColor = 'AccentColor',
  AccentColorTex = 'AccentColorText'
}

interface TProperty {
  name: string
  value: TNone
  initial: TNone
  percentages: null
  computedValue: TNone | string
  canonicalOrder: TOrderType
}

enum TNamedColors {
  aliceBlue = 'aliceblue',
  antiqueWhite = 'antiquewhite',
  aqua = 'aqua',
  aquamarine = 'aquamarine',
  azure = 'azure',
  beige = 'beige',
  bisque = 'bisque',
  black = 'black',
  blanchedAlmond = 'blanchedalmond',
  blue = 'blue',
  blueViolet = 'blueviolet',
  brown = 'brown',
  burlyWood = 'burlywood',
  cadetBlue = 'cadetblue',
  chartreuse = 'chartreuse',
  chocolate = 'chocolate',
  coral = 'coral',
  cornflowerBlue = 'cornflowerblue',
  cornsilk = 'cornsilk',
  crimson = 'crimson',
  cyan = 'cyan',
  darkBlue = 'darkblue',
  darkCyan = 'darkcyan',
  darkGoldenRod = 'darkgoldenrod',
  darkGray = 'darkgray',
  darkGreen = 'darkgreen',
  darkGrey = 'darkgrey',
  darkKhaki = 'darkkhaki',
  darkMagenta = 'darkmagenta',
  darkOliveGreen = 'darkolivegreen',
  darkOrange = 'darkorange',
  darkOrchid = 'darkorchid',
  darkRed = 'darkred',
  darkSalmon = 'darksalmon',
  darkSeaGreen = 'darkseagreen',
  darkSlateBlue = 'darkslateblue',
  darkSlateGray = 'darkslategrey',
  darkSlateGrey = 'darkslategrey',
  darkTurquoise = 'darkturquoise',
  darkViolet = 'darkviolet',
  deepPink = 'deeppink',
  deepSkyBlue = 'deepskyblue',
  dimGray = 'dimgray',
  dimGrey = 'dimgrey',
  dodgerBlue = 'dodgerblue',
  fireBrick = 'firebrick',
  floralWhite = 'floralwhite',
  forestGreen = 'forestgreen',
  fuchsia = 'fuchsia',
  gainsboro = 'gainsboro',
  ghostWhite = 'ghostwhite',
  gold = 'gold',
  goldenRod = 'goldenrod',
  gray = 'gray',
  green = 'green',
  greenYellow = 'greenyellow',
  grey = 'grey',
  honeyDew = 'honeydew',
  hotPink = 'hotpink',
  indianRed = 'indianred',
  indigo = 'indigo',
  ivory = 'ivory',
  khaki = 'khaki',
  lavender = 'lavender',
  lavenderBlush = 'lavenderblush',
  lawnGreen = 'lawngreen',
  lemonChiffon = 'lemonchiffon',
  lightBlue = 'lightblue',
  lightCoral = 'lightcoral',
  lightCyan = 'lightcyan',
  lightGoldenRodYellow = 'lightgoldenrodyellow',
  lightGray = 'lightgray',
  lightGreen = 'lightgreen',
  lightGrey = 'lightgrey',
  lightPink = 'lightpink',
  lightSalmon = 'lightsalmon',
  lightSeaGreen = 'lightseagreen',
  lightSkyBlue = 'lightskyblue',
  lightSlateGray = 'lightslategrey',
  lightSlateGrey = 'lightslategrey',
  lightSteelBlue = 'lightsteelblue',
  lightYellow = 'lightyellow',
  lime = 'lime',
  limeGreen = 'limegreen',
  linen = 'linen',
  magenta = 'magenta',
  maroon = 'maroon',
  mediumAquaMarine = 'mediumaquamarine',
  mediumBlue = 'mediumblue',
  mediumOrchid = 'mediumorchid',
  mediumPurple = 'mediumpurple',
  mediumSeaGreen = 'mediumseagreen',
  mediumSlateBlue = 'mediumslateblue',
  mediumSpringGreen = 'mediumspringgreen',
  mediumTurquoise = 'mediumturquoise',
  mediumVioletRed = 'mediumvioletred',
  midnightBlue = 'midnightblue',
  mintCream = 'mintcream',
  mistyRose = 'mistyrose',
  moccasin = 'moccasin',
  navajoWhite = 'navajowhite',
  navy = 'navy',
  oldLace = 'oldlace',
  olive = 'olive',
  oliveDrab = 'olivedrab', 
}

type TAbsoluteColorFunction = `rgb${string}` | `rgba${string}` | `hsl${string}` | `hsla${string}` | `hwb${string}` | `lab${string}` | `lch${string}` | `oklab${string}` | `oklch${string}` | `color${string}`
type TAbsoluteColorBase = `#${string}` | TAbsoluteColorFunction | TNamedColors | TTransparent

type TColorToken = TProperty & {
  name: 'color'
  initial: TSystemColors.CanvasText
  value: TAbsoluteColorBase | TCurrentColor | TSystemColors
}

type TTokenType = TColorToken | TDimension | TFontFamily | TFontWeight | TDuration | TCubicBezier

interface TToken {
  name: string
  value: string | {} | [] | number
  type: TTokenType
  path?: string
  description?: string
  extensions?: {}
  css?: string
  _props?: TProperty
}

class Token {
  token: TToken
  constructor (t: TToken) {
    this.token = t
  }

  toString (): string {
    return JSON.stringify(this.token, null, 2)
  }

  getToken (): TToken {
    return this.token
  }

  getType (): TTokenType {
    return this.token.type
  }

  toCSS (): void {
    switch (this.token.type) {
      case 'color':

        if (typeof this.token.value === 'number') {
          this.token.value = this.token.value.toString()
        }

        if (typeof this.token.value === 'undefined' && this.token._props !== undefined) {
          this.token.value = this.token._props.initial
        }

        // todo: this might fail for object values for non css use
        const raw = tinycolor(this.token.value as string)
        if (!raw.isValid()) throw new Error(`Invalid color ${this.token.value}`)
        this.token.css = `"${this.token.name.trim()}": ${raw.toString()};`
        break
      case 'fontFamily':
        const t = this.token.value as TFontFamily
        this.token.css = Array.isArray(t) ? t.map(x => `"${x}"`).join(', ') : `"${t}";`
        break
      case 'shadow':
        this.token.css = typeof this.token.value === 'string' ? `box-shadow: "${this.token.value}";` : `box-shadow: "${JSON.stringify(this.token.value, null, 2)}";`
        break
      default:
        break
        // we could infer type instead but the spec advises against it
        // todo: be more graceful
        // throw new Error(`Unsupported token type: ${this.token.type}`)
    }
  }
}

interface ParserOptions {
  destination: string
  format: 'css'
}

class Parser {
  opt: ParserOptions
  source: string | {}
  tokens: Array<TToken>

  constructor (source: {}, opt: ParserOptions) {
    this.source = source
    this.opt = opt
    this.tokens = this.readTokens(this.source)
  }

  readTokens (source: { [key: string]: any }): Array<TToken> {
    if (this.tokens === undefined) {
      this.tokens = []
    }

    for (const [k, v] of Object.entries(source)) {
      if (v.$value !== undefined && v.$value !== null) {
        const tt = new Token({ value: v.$value, name: k, type: v.$type ?? typeof v.$value })

        if (v.$description !== undefined) {
          tt.token.description = v.$description
        }

        if (v.$extensions !== undefined) {
          tt.token.extensions = v.$extensions
        }

        if (this.opt.format === 'css' && tt.getType() !== undefined) {
          tt.toCSS()
        }
        this.tokens.push(tt.getToken())
      } else {
        this.readTokens(v)
      }
    }
    return this.tokens
  }
}

export async function parse (source: {}, opt: ParserOptions): Promise<{ tokens: Array<TToken> }> {
  if (source === undefined) {
    throw new Error('source is undefined')
  }

  if (opt.format !== 'css') {
    throw new Error('unsupported format')
  }

  if (typeof source === 'string' && (source.startsWith('./') || source.startsWith('/'))) {
    source = await readFile(source, { encoding: 'utf8' })
  }

  const { tokens } = new Parser(source, opt)
  return { tokens }
}
