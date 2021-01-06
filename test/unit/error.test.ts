import { InformativeError } from '../../src/error'
// eslint-disable-next-line @typescript-eslint/no-empty-interface,import/no-unused-modules
interface CircularObject extends Record<string, string | CircularObject> {}

test('Contextual circular object is properly formatted', () => {
  const testObject: CircularObject = { plain: 'value' }
  testObject['circular'] = testObject

  const error = new InformativeError('Test message', { testObject })
  expect(error.toString()).toEqual(`Error: Test message with context
 {
  "testObject": {
    "plain": "value",
    "circular": "#CIRCULAR#"
  }
}`)
})

test('Deep object is truncated', () => {
  const testObject: CircularObject = {
    deep: {
      object: {
        is: { is: { is: { is: { is: { is: { is: { is: 'truncated' } } } } } } },
      },
    },
  }
  const error = new InformativeError('Test message', { testObject })
  expect(error.toString()).toEqual(`Error: Test message with context
 {
  "testObject": {
    "deep": {
      "object": {
        "is": {
          "is": {
            "is": {
              "is": {
                "is": {
                  "is": {
                    "is": "#TRUNCATED#"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`)
})
