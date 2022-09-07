import tap from 'tap'
import { parse, OutputFormat } from './lib/parser'

tap.test('token types', async (t) => {

  t.test('transparent', async t => {
    const transparent = {
      'Majestic magenta': {
        $value: 'transparent',
        $type: 'color'
      }
    }

    const {tokens, css} = await parse(transparent)
    t.same(tokens.length, 1)
    t.same(css, ':root { --majestic-magenta: rgb(0, 0, 0, 0); }')
  })
  t.test('color', async t => {
    const basic = {
      "brand": {
        "color": {
          'blue': {
            "900": {
              $value: '#0D5FFF',
              $type: 'color',
            },
            "300": {
              $value: '#C1D3F8',
              $type: 'color',
            },
          },
          'black': {
            $value: '#000000',
            $type: 'color',
          },
          'white': {
            $value: '#FFFFFF',
            $type: 'color',
          },
        }
      }
    }

    const {tokens, css} = await parse(basic, {
      colorFormat: 'hex',
      outputFormat: OutputFormat.CSS
    })
    t.same(tokens.length, 4)
  })

  t.test('dimension', async t => {
    const dimension = {
      "spacingStack1X": {
        "$value": "0.25rem",
        "$type": "dimension"
      }
    }

    const { tokens } = await parse(dimension)
    t.same(tokens[0].computedValue, 0.25)
    t.end()
  })

  t.test("fontFamily", async t => {
    const fonts = {
      "Primary font": {
        "$value": "Comic Sans MS",
        "$type": "fontFamily"
      },
      "Body font": {
        "$value": ["Helvetica", "Arial"],
        "$type": "fontFamily"
      }
    }

    const { tokens } = await parse(fonts)
    t.same(tokens[0].computedValue, ["Comic Sans MS"])
  })

  t.test("fontWeight", async t => {
    const weights = {
      "font-weight-default": {
        "$value": 350,
        "$type": "fontWeight"
      },
      "font-weight-thick": {
        "$value": "extra-bold",
        "$type": "fontWeight"
      }
    }

    const { tokens } = await parse(weights)
    t.same(tokens[0].computedValue, 350)
  })

  // t.test("duration", async t => {
  //   const duration = {
  //     "Duration-100": {
  //       "$value": "100ms",
  //       "$type": "duration"
  //     },
  //     "Duration-200": {
  //       "$value": "200ms",
  //       "$type": "duration"
  //     }
  //   }
  //
  //   const { tokens } = await parse(duration)
  //   t.end()
  // })
  //
  t.test("cubicBezier", async t => {
    const cubicBezier = {
      "Accelerate": {
        "$value": [0.5, 0, 1, 1],
        "$type": "cubicBezier"
      },
      "Decelerate": {
        "$value": [0, 0, 0.5, 1],
        "$type": "cubicBezier"
      }
    }
    const {tokens} = await parse(cubicBezier)
    console.log(tokens)
  })
  t.end()
})