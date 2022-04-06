
import { flatIterator, filterUndefined } from "../types/utils.mjs"
import { UInt8 } from "../types/numeric.mjs"
import { Float32Vector2 } from "../types/vector.mjs"

const SYMBOL_0 = Symbol("0")
const SYMBOL_1 = Symbol("1")
const SYMBOL_2 = Symbol("2")
const SYMBOL_3 = Symbol("3")

const SIZE = 4
const FLAT_SIZE = SIZE * 2

export class FrameTexture {
  #id = new UInt8()
  get id() { return this.#id.value }
  set id(id) { this.#id = new UInt8(id) }

  ;[SYMBOL_0] = new Float32Vector2(0, 0) // [0] left-top
  ;[SYMBOL_1] = new Float32Vector2(1, 0) // [1] right-top
  ;[SYMBOL_2] = new Float32Vector2(1, 1) // [2] right-bottom
  ;[SYMBOL_3] = new Float32Vector2(0, 1) // [3] left- bottom

  get [0]() { return this[SYMBOL_0] }
  set [0](value) { this[SYMBOL_0] = new Float32Vector2(value) }

  get [1]() { return this[SYMBOL_1] }
  set [1](value) { this[SYMBOL_1] = new Float32Vector2(value) }

  get [2]() { return this[SYMBOL_2] }
  set [2](value) { this[SYMBOL_2] = new Float32Vector2(value) }

  get [3]() { return this[SYMBOL_3] }
  set [3](value) { this[SYMBOL_3] = new Float32Vector2(value) }

  get cords() {
    const [, ...cords] = this
    return cords
  }

  get positions() {
    const cords = this.cords
    return [
      cords[0 * 2 + 0], cords[0 * 2 + 1], // [0] left-top
      cords[1 * 2 + 0], cords[1 * 2 + 1], // [1] right-top
      cords[2 * 2 + 0], cords[2 * 2 + 1], // [2] right-bottom

      cords[0 * 2 + 0], cords[0 * 2 + 1], // [0] left-top
      cords[2 * 2 + 0], cords[2 * 2 + 1], // [2] right-bottom
      cords[3 * 2 + 0], cords[3 * 2 + 1], // [3] left- bottom
    ]
  }

  *[Symbol.iterator]() {
    yield this.id
    for (let i = 0; i < SIZE; i++) {
      const [x, y] = this[i]
      yield x
      yield y
    }
  }

  constructor(...args) {
    const [id, ...items] = [...flatIterator(filterUndefined(args))]
    const length = items.length

    if (id === undefined && length === 0) { // Default FrameTexture 
      return this
    }

    if (length !== FLAT_SIZE) {
      throw new TypeError(`FrameTexture [constructor]: Size "${length}" not equal to ${FLAT_SIZE}`)
    }

    this.id = id
    for (let i = 0; i < SIZE; i++) {
      this[i] = [items[i * 2 + 0], items[i * 2 + 1]]
    }
  }

  toJSON() { return [...this] }
}
