const tap = require('tap')
const { parse } = require('./dist/parser.js')

tap.test('colors', t => {
  const colors = {
    "$description": "Brand colors",
    'primary': {
      $value: '#0D5FFF',
      $type: 'color'
    },
    'secondary': {
      $value: '#344054',
      $type: 'color'
    },
    'white': {
      $value: '#FFFFFF',
      $type: 'color'
    }
  }
  const result = parse({
    source: colors,
    format: 'css'
  })
  console.log(result)
  t.end()
})
