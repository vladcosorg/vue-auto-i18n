import { splitStringIntoChunks } from '../../src/util'

test('Split', () => {
  const data =
    '<b1>Hello my name is frosty</b1><b2>Hello my name is frosty</b2><b4>Hello</b4><b3>Hello my name is frosty Hello my name is frosty</b3> Hello my name is frosty Hello my name is frosty Hello my name is frosty Hello my name is frosty'

  expect(splitStringIntoChunks(data, 60)).toStrictEqual([
    '<b1>Hello my name is frosty</b1><b2>Hello my name is frosty</b2>',
    '<b4>Hello</b4><b3>Hello my name is frosty Hello my name is frosty</b3>',
    ' Hello my name is frosty Hello my name is frosty Hello my na',
    'me is frosty Hello my name is frosty',
  ])
})
