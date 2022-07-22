const openTypeFontWeights = {
  "thin": 10,
  "hairline": 10
}

type Color = `#string`
type Dimension = `${string}px` | `${string}rem`
type FontFamily = string
type FontWeight = string
type Duration = `${string}ms`
type CubicBezier = number[]

type Token = {
    name: string
    value?: string | {}|  [] | number
    type: Color | Dimension | FontFamily | FontWeight |  Duration | CubicBezier
    description?: string
    path: string
    extensions: {}
}

function parser(input: string | {}): any {
    let tokens: Token[] = []

    if (typeof input === "string") input = JSON.parse(input)
    
    if (input === null || input === undefined) throw new Error("input is empty")

    for (const [k, v] of Object.entries(input)) {
        if (k.startsWith("$")) throw new Error(`token name must not begin with the "$". Found ${k}`)
        if (k.indexOf("{") !== -1 || k.indexOf("}") !== -1 || k.indexOf(".") !== -1) throw new Error(`token name must not include {, }, . Error at: ${k}`)
        let t: Token
        if (typeof v === "object" && v !== null) {
          if (!v.hasOwnProperty("$value")) throw new Error("token must include value property")

          t = {
            name: k,
            value: v["$value"],
            path: k,
            type: "32px"
          }

          if (v.hasOwnProperty("$description")){
            t.description = v["$description"]
          }
          tokens.push(t)

        }
      }
      console.log(JSON.stringify(tokens, null, 2))
}

const examples = {
  minimal: {
    'token name': {
      $value: 'token value'
    }
  },
  with_metdata: {
    'border-color': {
      $value: 'token value',
      $metadata: "moremetahere"
    }
  },
  invalid_token_char: {
    'bo{rder-color': {
      $value: 'token value',
      $metadata: "moremetahere"
    }
  },
  composite_shadow: {
    'shadow-token': {
      $type: 'shadow',
      $value: {
        color: '#00000088',
        offsetX: '0.5rem',
        offsetY: '0.5rem',
        blur: '1.5rem',
        spread: '0rem'
      }
    },
    'anothersuper-token': {
      $type: 'shadow',
      $value: {
        color: '#00000088',
        offsetX: '0.5rem',
        offsetY: '0.5rem',
        blur: '1.5rem',
        spread: '0rem'
      }
    }
  },
  bad_token_start: {
    $bad_example: {
      $type: 'color',
      $value: [0, 0, 0, 0]
    }
  },
  groups: {
    'token uno': {
      $value: 'token value 1'
    },
    'token group': {
      'token dos': {
        $value: 'token value 2'
      },
      'nested token group': {
        'token tres': {
          $value: 'token value 3'
        },
        'Token cuatro': {
          $value: 'token value 4'
        }
      }
    }
  }
}

parser(examples["minimal"])