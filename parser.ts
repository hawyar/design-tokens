import { readFile } from 'fs/promises'
import tinycolor from 'tinycolor2'

interface TToken {
  name: string
  value: string | {} | [] | number
  type: 'color' | 'dimension' | 'font-family' | 'font-weight' | 'duration' | 'cubic-bezier'
  path: string
  description?: string
  extensions?: {}
  computedValue?: string | {}
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

  detectType (): void {
    switch (this.token.type) {
      case 'color':
        const raw = tinycolor(this.token.value as string)
        if (!raw.isValid()) throw new Error(`Invalid color: ${this.token.value}`)
        if (raw.getFormat() !== 'hex') throw new Error('The value MUST be a string containing a hex triplet/quartet including the preceding # character')
        break
      default:
        throw new Error(`Unsupported token type: ${this.token.type}`)
    }
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

        tt.detectType()
        this.tokens.push(tt.getToken())
      } else {
        // this._paths.push(k)
        this.readTokens(v)
      }
    }
    return this.tokens
  }

  computeValues (): void {
    for (const t of this.tokens) {
      switch (t.type) {
        case 'color':
          console.log(this.opt.colorFormat)
          if (this.opt.colorFormat === 'rgb') {
            t.computedValue = tinycolor(t.value as string).toRgbString()
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
            return
          }
          break
        default:
          break
      }
    }
  }
}

export async function parse (source: {} | string, opt: ParserOptions): Promise<{ tokens: TToken[] }> {
  if (source === undefined) {
    throw new Error('source is undefined')
  }

  if (typeof source === 'string' && (source.endsWith('.tokens') || source.endsWith('.tokens.json'))) {
    source = await readFile(source, { encoding: 'utf8' })
  }

  if (opt.colorFormat === undefined) {
    opt.colorFormat = 'rgb'
  }

  const p = new Parser(source, opt)
  p.computeValues()
  console.log(p.tokens)
  return { tokens: p.tokens }
}
