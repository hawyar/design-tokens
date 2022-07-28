import fs from 'fs'


// todo: fix this mess
type TColor = '#string'
type TDimension = `${string}px` | `${string}rem`
type TFontFamily = string | []
type TFontWeight = string
type TDuration = `${string}ms`
type TCubicBezier = number[]
type TTokenType = TColor | TDimension | TFontFamily | TFontWeight | TDuration | TCubicBezier

interface TToken {
  value: string | {}| [] | number
  type: TTokenType
  path: string
  name: string
  description?: string
  extensions?: {}
  css: string | {} | null
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
  source: string | {}
  destination: string
  format: 'css'
}

class Parser {
  opt: ParserOptions
  tokens: TToken[]

  constructor (opt: ParserOptions) {
    this.opt = opt
    this.tokens = []
  }

  readTokens (): TToken[] {
    for (const [k, v] of Object.entries(this.opt.source)) {
      if (v.$value !== undefined) {
        const token = new Token({
          name: k,
          type: v["$type"] ?? typeof v["$value"],
          value: v,
          description: v["$description"] ?? '',
          path: k,
          css: ''
        })
        if (this.opt.format === 'css') {
          token.toCSS()
        }
        this.tokens.push(token.getToken())
        continue
      }
      console.log('has nested tokens')
    }
    return this.tokens
  }
}

export function parse (opt: ParserOptions): { tokens: TToken[] } {
  if (opt === undefined) {
    throw new Error('Parser options are required')
  }

  if (opt.format !== 'css') {
    throw new Error('Unsupported format')
  }

  if (typeof opt.source === 'string' && (opt.source.startsWith('./') || opt.source.startsWith('/'))) {
    opt.source = fs.readFileSync(opt.source, 'utf8')
  }

  if (typeof opt.source === 'string') {
    opt.source = JSON.parse(opt.source)
  }

  const parser = new Parser(opt)
  const tokens = parser.readTokens()

  return { tokens }
}
