const tap = require('tap')
const { parse } = require('./dist/parser.js')


tap.test('token types', async (t) => {
  t.test('color', async t => {
    const color = {
      'Majestic magenta': {
        $value: '#ff00ff',
        $type: 'color'
      }
    }

    const { tokens } = await parse(color, {
      colorFormat: 'rgba'
    })
    t.same(tokens.length, 1)
    t.end()
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
    t.end()
    // t.same(tokens[0].computedValue, )
  })

  t.test("duration", async t => {
    const duration = {
      "Duration-100": {
        "$value": "100ms",
        "$type": "duration"
      },
      "Duration-200": {
        "$value": "200ms",
        "$type": "duration"
      }
    }

    const { tokens } = await parse(duration)
    console.log(tokens[0].computedValue)
    t.end()
  })

  t.test("cubicBezier", async t => {
    const cubicBezier =  {
      "Accelerate": {
        "$value": [0.5, 0, 1, 1],
        "$type": "cubicBezier"
      },
      "Decelerate": {
        "$value": [0, 0, 0.5, 1],
        "$type": "cubicBezier"
      }
    }

    const { tokens } = await parse(cubicBezier)
    console.log(tokens[0].computedValue)
    t.end()
  })



})
