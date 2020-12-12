type GenericObject = Record<string, unknown>
type Context = GenericObject | string | number | null | undefined
export class InformativeError extends Error {
  constructor(message?: string, protected context?: Context) {
    super(message)
  }

  protected stringifyContext(
    context: Context | string | number | null | undefined,
  ): string {
    if (context && typeof context === 'object') {
      context = copyWithoutCircularReferences([context], context)
    }
    return JSON.stringify(context, undefined, 2)
  }

  public toString(): string {
    return `${this.name}: ${
      this.message
    } with context\n ${this.stringifyContext(this.context)}`
  }
}

function copyWithoutCircularReferences(
  references: GenericObject[],
  object: GenericObject,
  depth = 0,
): GenericObject {
  const cleanObject: GenericObject = {}

  Object.keys(object).forEach(function (key) {
    const value = object[key] as GenericObject
    if (value && typeof value === 'object') {
      if (!references.includes(value)) {
        references.push(value)
        cleanObject[key] =
          ++depth < 10
            ? copyWithoutCircularReferences(references, value, depth)
            : '#TRUNCATED#'
        references.pop()
      } else {
        cleanObject[key] = '#CIRCULAR#'
      }
    } else if (typeof value !== 'function') {
      cleanObject[key] = value
    }
  })

  return cleanObject
}
