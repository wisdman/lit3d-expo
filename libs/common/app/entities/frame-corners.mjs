
import { flatIterator, filterUndefined } from "../types/utils.mjs"
import { Int16Vector2 } from "../types/vector.mjs"

import { DEFAULT_RESOLUTION } from "./constants.mjs"
const [DW, DH] = DEFAULT_RESOLUTION

const SYMBOL_0 = Symbol("0")
const SYMBOL_1 = Symbol("1")
const SYMBOL_2 = Symbol("2")
const SYMBOL_3 = Symbol("3")

const SIZE = 4
const FLAT_SIZE = SIZE * 2

export class FrameCorners {
  ;[SYMBOL_0] = new Int16Vector2( 0,  0) // [0] left-top
  ;[SYMBOL_1] = new Int16Vector2(DW,  0) // [1] right-top
  ;[SYMBOL_2] = new Int16Vector2(DW, DH) // [2] right-bottom
  ;[SYMBOL_3] = new Int16Vector2( 0, DH) // [3] left- bottom

  get [0]() { return this[SYMBOL_0] }
  set [0](value) { this[SYMBOL_0] = new Int16Vector2(value) }

  get [1]() { return this[SYMBOL_1] }
  set [1](value) { this[SYMBOL_1] = new Int16Vector2(value) }

  get [2]() { return this[SYMBOL_2] }
  set [2](value) { this[SYMBOL_2] = new Int16Vector2(value) }

  get [3]() { return this[SYMBOL_3] }
  set [3](value) { this[SYMBOL_3] = new Int16Vector2(value) }

  move(...args) {
    // move(index, dx, dy)
    if (args.length >= 3) { 
      const [i, dx, dy] = args
      const [x, y] = this[i]
      this[i] = [x + dx, y + dy]
      return
    }

    // move(dx, dy)
    const [dx = 0, dy = dx] = args
    for (let i = 0; i < SIZE; i++) {
      const [x, y] = this[i]
      this[i] = [x + dx, y + dy]
    }
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < SIZE; i++) {
      const [x, y] = this[i]
      yield x
      yield y
    }
  }

  constructor(...args) {
    const items = [...flatIterator(filterUndefined(args))]
    const length = items.length

    if (length === 0) { // Default Corners 
      return this
    }

    if (length !== FLAT_SIZE) {
      throw new TypeError(`Corners [constructor]: Size "${length}" not equal to ${FLAT_SIZE}`)
    }

    for (let i = 0; i < SIZE; i++) {
      this[i] = [items[0 * 2 + 0], items[0 * 2 + 1]]
    }
  }

  toJSON() { return [...this] }
}
