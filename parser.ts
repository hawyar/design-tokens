import { readFile } from 'fs/promises'
import tinycolor from 'tinycolor2'


// enum FontWeight {
//   THIN, HAIR = 100,
//   EXTRA_LIGHT, ULTRA_LIGHT = 200,
//   LIGHT = 300,
//   NORMAL, REGULAR, BOOK = 400,
//   MEDIUM = 500,
//   SEMI_BOLD, DEMI_BOLD = 600,
//   BOLD = 700,
//   EXTRA_BOLD , ULTRA_BOLD = 800,
//   BLACK, HEAVY = 900,
//   EXTRA_BLACK, ULTRA_BLACK = 950,
// }

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
    ULTRA_BLACK: 950,
}

interface TToken {
  name: string
  value: string | {} | [] | number
  type: 'color' | 'dimension' | 'fontFamily' | 'fontWeight' | "duration" | "cubicBezier"
  path: string
  description?: string
  extensions?: {}
  computedValue?: string | {} | [] | number
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
}

interface ParserOptions {
  colorFormat: 'rgb' | 'rgba' | 'hex' | 'hsl'
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
    if (this._paths === undefined) this._paths = []

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

        this.computeValue(tt.getToken())
        this.tokens.push(tt.getToken())
      } else {
        // this._paths.push(k)
        this.readTokens(v)
      }
    }
    return this.tokens
  }

  computeValue(t: TToken): void {
    switch (t.type) {
      case 'color':
        const raw = tinycolor(t.value as string)
        if (!raw.isValid()) throw new Error(`Invalid color: ${t.value}`)
        if (raw.getFormat() !== 'hex') throw new Error('The value MUST be a string containing a hex triplet/quartet including the preceding # character')

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
          t.computedValue = tinycolor(t.value as string).toPercentageRgb()
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
}

export async function parse (source: {} | string, opt: ParserOptions = { colorFormat: 'rgb' }): Promise<{ tokens: TToken[] }> {
  if (source === undefined) {
    throw new Error('source is undefined')
  }

  if (typeof source === 'string' && (source.endsWith('.tokens') || source.endsWith('.tokens.json'))) {
    source = await readFile(source, { encoding: 'utf8' })
  }

  const p = new Parser(source, opt)
  return { tokens: p.tokens }
}
