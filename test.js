const tap = require('tap')
const { parse } = require('./dist/parser.js')

tap.test('color', async t => {
  t.test('basic', async t => {
    const color = {
      primary: {
        $type: 'color',
        $value: 'blue'
      }
    }

    const { tokens } = await parse(color, {
      format: 'css'
    })
    t.same(tokens.length, 1)
  })

  t.test('nested', async t => {
    const brand = {
      web: {
        primary: {
          $type: 'color',
          $value: 'blue'
        }
      },
      print: {
        secondary: {
          $type: 'color',
          $value: 'red'
        }
      }
    }

    const { tokens } = await parse(brand, {
      format: 'css'
    })
    t.same(tokens.length, 2)
  })

  t.end()
})

// tap.test('basic', async t => {
//   const basic = {
//     'btn-bg': {
//       $value: '#777777',
//       $description: 'The background color for buttons in their normal state.'
//     }
//   }
//   const { tokens } = await parse(basic, {
//     format: 'css'
//   })

//   t.same(tokens[0].name, 'btn-bg')
//   t.end()
// })

// tap.test('nested', async t => {
//   const nested = {
//     'token uno': {
//       $value: 'token value 1'
//     },
//     'token group': {
//       'token dos': {
//         $value: 'token value 2',
//         $type: 'color'
//       },
//       'nested token group': {
//         'token tres': {
//           $value: 'token value 3'
//         },
//         'Token cuatro': {
//           $value: 'token value 4',
//           $description: 'token description'
//         }
//       }
//     }
//   }
//   const { tokens } = await parse(nested, {
//     format: 'css'
//   })

//   t.same(tokens.length, 4)
//   t.end()
// })

// tap.test('composite tokens', async t => {
//   const composite = {
//     'shadow-token': {
//       $type: 'shadow',
//       $value: {
//         color: '#00000088',
//         offsetX: '0.5rem',
//         offsetY: '0.5rem',
//         blur: '1.5rem',
//         spread: '0rem'
//       }
//     }
//   }

//   const { tokens } = await parse(composite, {
//     format: 'css'
//   })
//   console.log(tokens)
//   t.same(tokens.length, 1)
//   t.end()
// })
