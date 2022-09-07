import { readFile } from 'fs/promises'
import tinycolor from 'tinycolor2'
import { noCase } from 'no-case'

export enum OutputFormat {
    CSS,
    SCSS,
}

interface Options {
  colorFormat: 'rgb' | 'rgba' | 'hex' | 'hsl'
  outputFormat: OutputFormat
}

type TNone = 'none'
type TTransparent = 'transparent'
type TCurrentColor = 'currentcolor'

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
}

type TAbsoluteColorFunction = `rgb${string}` | `rgba${string}` | `hsl${string}` | `hsla${string}` | `hwb${string}` | `lab${string}` | `lch${string}` | `oklab${string}` | `oklch${string}` | `color${string}`
type TAbsoluteColorBase = `#${string}` | TAbsoluteColorFunction | TTransparent // and TNamedColor

type TColorToken = {
  name: 'color'
  initial: TSystemColors.CanvasText
  value: TAbsoluteColorBase | TCurrentColor | TSystemColors
}

interface TToken {
  name: string
  value: string | {} | [] | number
  computedValue?: string | {} | [] | number
  // todo: clean this
  type: "color" | "dimension" | "fontFamily" | "fontWeight" | "duration" | "cubicBezier",
  isComposite?: boolean
  path: string
  description?: string
  extensions?: {}
  normalizedName?: string
  css?: string
}

class Token {
  token: TToken
  constructor (t: TToken) {
    this.token = {
        ...t,
    }
  }
  getToken (): TToken {
    return this.token
  }
  private normalizeName(): void {
    this.token.normalizedName = noCase(this.token.path, { delimiter: "-"})
  }

  toCSS (): void {
    this.normalizeName()
    switch (this.token.type) {
        case "color":
          if (this.token.value === "transparent") {
            this.token.css = `--${this.token.normalizedName}: rgb(0, 0, 0, 0);`
            return
          }
          this.token.css = `--${this.token.normalizedName}: ${this.token.computedValue};`
            break
        default:
          break
    }
  }
}

class Parser {
  opt: Options
  source: {}
  tokens: TToken[]
  private _paths: string[]
  private _tmp: string[]

  constructor (source: {}, opt: Options) {
    this.source = source
    this.opt = opt
    this.tokens = this.readTokens(this.source)
    this._paths = []
    this._tmp = []
  }

  readTokens (source: { [key: string]: any }): TToken[] {

    if (this._paths === undefined) this._paths = []
    if (this._tmp === undefined) this._tmp = []
    if (this.tokens === undefined) this.tokens = []

    for (const [k, v] of Object.entries(source)) {
      if (v.hasOwnProperty('$value') && v.hasOwnProperty('$type')) {
        this._paths = [...this._tmp, k]

        const t = {
          value: v.$value,
          name: k,
          type: v.$type ?? typeof v.$value, path: this._paths.join('/'),
          isComposite: typeof v.$value === "object"
        }

        if (typeof v["$value"] === "object") {
          t.isComposite = true
        }

        const tt = new Token(t)

        if (v.hasOwnProperty('$description')) {
          tt.token.description = v.$description
        }

        if (v.hasOwnProperty('$extensions')) {
          tt.token.extensions = v.$extensions
        }

        this.computeValue(tt.getToken())
        tt.toCSS()
        this.tokens.push(tt.getToken())
        this._paths = []
      } else {
        this._tmp.push(k)
        this.readTokens(v)
      }
    }
    return this.tokens
  }

  computeValue(t: TToken): void {
    switch (t.type) {
      case 'color':
        if (t.value === "transparent") {
          t.computedValue = tinycolor("#ffffff").setAlpha(0).toRgbString()
          return
        }

        const raw = tinycolor(t.value as string)

        if (!raw.isValid()) throw new Error(`TColor: Invalid color: ${t.value}`)

        if (typeof t.value === "string" && !t.value.startsWith('#')) {
          t.computedValue = raw.toString("name")
          return
        }

        if (raw.getFormat() !== 'hex') throw new Error('TColor: The value MUST be a string containing a hex triplet/quartet including the preceding # character')

        if (this.opt.colorFormat === 'rgb') {
          t.computedValue = raw.toRgbString()
          return
        }

        if (this.opt.colorFormat === 'hex') {
          t.computedValue = tinycolor(t.value as string).toHexString()
          return
        }

        if (this.opt.colorFormat === 'hsl') {
          t.computedValue = tinycolor(t.value as string).toHslString()
          return
        }

        if (this.opt.colorFormat === 'rgba') {
          const {r,g,b,a} = tinycolor(t.value as string).toPercentageRgb()
          t.computedValue = `rgba(${r}, ${g}, ${b}, ${a})`
          return
        }
        break
      case 'dimension':
        const unit = t.value.toString().replace(/[0-9.]/g, '')
        if (unit === 'px' || unit === 'rem') {
          t.computedValue = parseFloat(t.value.toString().replace(/[a-z]/g, ''))
          return
        }
        throw new Error('The value must be a string containing a number (either integer or floating-point) followed by either a "px" or "rem" unit (future spec iterations may add support for additional units)')
      case 'fontFamily':
        t.computedValue = Array.isArray(t.value) ? t.value : [t.value]
        break
      case 'fontWeight':
        if (typeof t.value === 'number') {
          if (t.value < 1 || t.value > 1000) throw new Error('The value must be a number between 1 and 1000')
          t.computedValue = t.value
          return
        }
      case 'duration':
        const durationUnit = t.value.toString().replace(/[0-9.]/g, '')
        t.computedValue = {
          unit: durationUnit,
          value: t.value.toString().replace(/[a-z]/g, '')
        }
        break

      case "cubicBezier":
        if (!Array.isArray(t.value)) throw new Error('The value must be an array of 4 numbers')

        for (const v of t.value) {
            if (typeof v !== 'number') throw new Error('The value must be an array of 4 numbers')
        }
        const [P1x, P1y, P2x, P2y] = t.value as number[]
        if (P1x < 0 || P1x > 1) throw new Error("x coordinate of P1 must be between 0 and 1")
        if (P2x < 0 || P2x > 1) throw new Error("x coordinate of P2 must be between 0 and 1")

        if (P1y < -Infinity || P1y > Infinity) throw new Error("y coordinate of P1 must be between -Inf and Inf")
        if (P2y < -Infinity || P2y > Infinity) throw new Error("y coordinate of P2 must be between -Inf and Inf")
        t.computedValue = t.value
        break
      default:
        throw new Error("not implemented yet")
    }
  }
  wrapCSSInRoot (): string {
    return `:root { ${this.tokens.map(t => t.css).join('\n')} }`
  }
}

export async function parse (source: {} | string, opt: Options = { colorFormat: 'rgb', outputFormat: OutputFormat.CSS }): Promise<{ tokens: TToken[], css: string }> {
  if (source === undefined) {
    throw new Error('Source is undefined')
  }

  if (typeof source === 'string' && source.startsWith('{')) {
    source = JSON.parse(source)
  }

  if (typeof source === 'string' && (source.endsWith('.tokens') || source.endsWith('.tokens.json'))) {
    source = await readFile(source, { encoding: 'utf8' })
  }

  const p = new Parser(source, opt)

  return {
    tokens: p.tokens,
    css: p.wrapCSSInRoot()
  }
}
