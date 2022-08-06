const tap = require('tap')
const { parse } = require('./dist/parser.js')

tap.test('color', async t => {
  const color = {
    "Majestic magenta": {
      "$value": "ff00ff",
      "$type": "color"
    }
  }

  const { tokens } = await parse(color, {
    format: 'css'
  })
  t.same(tokens.length, 1)
  t.end()
})

// tap.test('brand', async t => {
//   const brand = {
//     colors: {
//       primary: {
//         blue: {
//           $value: '#0D5FFF',
//           $type: 'color',
//           $description: 'Primary blue color'
//         },
//         black: {
//           $value: '#000000',
//           $type: 'color',
//           $description: 'Primary white color'
//         },
//         white: {
//           $value: '#FFFFFF',
//           $type: 'color',
//           $description: 'Primary white color'
//         }
//       }
//     }
//   }
//   const { tokens } = await parse(brand, {
//     format: 'css'
//   })
//   t.same(tokens.length, 3)
//   t.end()
// })
