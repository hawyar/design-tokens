import { readFile } from 'fs/promises'
import tinycolor from 'tinycolor2'

type TNone = 'none'
type TTransparent = 'transparent'
type TCurrentColor = 'currentcolor'

type TDimension = `${string}px` | `${string}rem`
type TFontFamily = string | string[]
type TFontWeight = string
type TDuration = `${string}ms`
type TCubicBezier = number[]

enum TOrderType {
  GRAMMAR = 'per grammar'
}

enum FontWeightNumericWithAlias {
  HAIRLINE = 100,
  THIN = 100,
  EXTRA_LIGHT = 200,
  ULTRA_LIGHT = 200,
  LIGHT= 300,
  NORMAL = 400,
  REGULAR = 400,
  BOOK = 400,
  MEDIUM = 500,
  SEMI_BOLD = 600,
  DEMI_BOLD = 600,
  BOLD = 700,
  EXTRA_BOLD = 800,
  ULTRA_BOLD = 800,
  BLACK = 900,
  HEAVY = 900,
  EXTRA_BLACK = 950,
  ULTRA_BLACK = 950
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
  AccentColorText = 'AccentColorText'
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
  ALICE_BLUE = 'aliceblue',
  ANTIQUE_WHITE = 'antiquewhite',
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

interface TColorToken {
  name: 'color'
  initial: TSystemColors.CanvasText
  value: TAbsoluteColorBase | TCurrentColor | TSystemColors
}

type TTokenType = TColorToken | TDimension | TFontFamily | TFontWeight | TDuration | TCubicBezier

interface TToken {
  name: string
  value: string | {} | [] | number
  type: TTokenType
  path: string
  description?: string
  extensions?: {}
}

class Token {
  token: TToken
  props: TProperty | null
  constructor (t: TToken) {
    this.token = t
    this.props = null
  }

  toString (): string {
    return JSON.stringify(this.token, null, 2)
  }

  getToken (): TToken {
    return this.token
  }


  detectType (): void {
    switch (this.token.type) {
      case 'color':
        const raw = tinycolor(this.token.value as string)
        if (!raw.isValid()) throw new Error(`Invalid color: ${this.token.value}`)
        if (raw.getFormat() !== "hex") throw new Error("The value MUST be a string containing a hex triplet/quartet including the preceding # character")

          const t: TAbsoluteColorBase = this.token.value as TAbsoluteColorBase
        break
      default:
        throw new Error(`Unsupported token type: ${this.token.type}`)
    }
  }
}

interface ParserOptions {
  output: string
  format: 'css'
}

class Parser {
  opt: ParserOptions
  source: string | {}
  tokens: TToken[]
  _paths: string[]

  constructor (source: {}, opt: ParserOptions) {
    this.source = source
    this.opt = opt
    this.tokens = this.readTokens(this.source)
    this._paths = []
  }

  readTokens (source: { [key: string]: any }): TToken[] {
    if (typeof this._paths === 'undefined') this._paths = []

    if (this.tokens === undefined) this.tokens = []

    for (const [k, v] of Object.entries(source)) {
      if (v.hasOwnProperty('$value') && v.hasOwnProperty('$type')) {
        this._paths.push(k)
        const tt = new Token({ value: v.$value, name: k, type: v.$type ?? typeof v.$value, path: this._paths.join('/') })

        if (v.hasOwnProperty('$description')) {
          tt.token.description = v.$description
        }

        if (v.hasOwnProperty('$extensions')) {
          tt.token.extensions = v.$extensions
        }
        tt.detectType()
        console.log(tt)
        this.tokens.push(tt.getToken())
      } else {
        // this._paths.push(k)
        this.readTokens(v)
      }
    }
    return this.tokens
  }
}

export async function parse (source: {} | string, opt: ParserOptions): Promise<{ tokens: TToken[] }> {
  if (source === undefined) {
    throw new Error('source is undefined')
  }

  if (opt !== undefined && opt.format !== 'css') {
    throw new Error('unsupported format')
  }

  if (typeof source === 'string' && (source.endsWith('.tokens') || source.endsWith('.tokens.json'))) {
    source = await readFile(source, { encoding: 'utf8' })
  }

  const { tokens } = new Parser(source, opt)
  return { tokens }
}
