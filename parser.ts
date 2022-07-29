import { readFile } from 'fs/promises'

type TColor = '#string'
type TDimension = `${string}px` | `${string}rem`
type TFontFamily = string | []
type TFontWeight = string
type TDuration = `${string}ms`
type TCubicBezier = number[]
type TTokenType = TColor | TDimension | TFontFamily | TFontWeight | TDuration | TCubicBezier


interface TToken {
  name: string
  value: string | {}| [] | number
  type: TTokenType
  path: string
  description?: string
  extensions?: {}
  css?: string

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
        const val = typeof this.token.value === 'string' ? this.token.value : this.token.value["$value"]
        this.token.css = `"${this.token.name.trim()}": ${val};`
        break
      case 'fontFamily':
        const t = this.token.value as TFontFamily
        this.token.css = Array.isArray(t) ? t.map(x => `"${x}"`).join(', ') : `"${t}";`
        break
      case 'shadow':
        this.token.css = `box-shadow: "${this.token.value}";`
        break
      default:
        throw new Error(`Unsupported token type: ${this.token.type}`)
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
  tokens: TToken[]

  constructor (source: {},opt: ParserOptions) {
    this.source = source
    this.opt = opt
    this.tokens = this.readTokens(this.source)
  }

  readTokens (source: {}): TToken[] {
    if (this.tokens === undefined) {
      this.tokens = []
    }

    for (const [k, v] of Object.entries(source)) {
      if (v["$value"] !== undefined && v["$value"] !== null) {
        const tt = new Token({ value: v["$value"], name: k })
        if (v["$type"] !== undefined) {
          tt.token.type = v["$type"] as TTokenType
        }

        if (v["$description"] !== undefined) {
          tt.token.description = v["$description"]
        }

        if (v["$extensions"] !== undefined) {
          tt.token.extensions = v["$extensions"]
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

export async function parse (source: {}, opt: ParserOptions): Promise<{ tokens: TToken[] }> {
  if (source === undefined) {
    throw new Error("source is undefined")
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
