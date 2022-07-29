const tap = require('tap')
const { parse } = require('./dist/parser.js')

tap.test('basic', async t => {
  const basic = {
    'btn-bg': {
      $value: '#777777',
      $description: 'The background color for buttons in their normal state.'
    }
  }
  const { tokens } = await parse(basic, {
    format: 'css'
  })

  t.same(tokens[0].name, "btn-bg")
  t.end()
})

tap.test('nested', async t => {
  const nested = {
    "token uno": {
      "$value": "token value 1"
    },
    "token group": {
      "token dos": {
        "$value": "token value 2",
        "$type": 'color'
      },
      "nested token group": {
        "token tres": {
          "$value": "token value 3"
        },
        "Token cuatro": {
          "$value": "token value 4",
          "$description": "token description"
        }
      }
    }
  }
  const { tokens } = await parse(nested,{
    format: 'css'
  })

  t.same(tokens.length, 4)
  t.end()
})
