
const CLASS_RX = /^\s*class\s+/
export const isClass = value => typeof value === "function" && CLASS_RX.test(value.toString())

export const isIterable = value => typeof value?.[Symbol.iterator] === "function"

export const filterUndefined = value => value.filter(item => item !== undefined)

export const flatIterator = function* (items) {
  for (let item of items) {
    if (isIterable(item)) 
      yield* flatIterator(item)
    else yield item
  }
}
