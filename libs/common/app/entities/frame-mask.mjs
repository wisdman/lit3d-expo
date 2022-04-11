
import { UInt16 } from "../types/numeric.mjs"

export class FrameMask {
  #size = new UInt16()
  get size() { return this.#size.value }
  set size(size) { this.#size = new UInt16(size) } 

  #from = new UInt16()
  get from() { return this.#from.value }
  set from(from) { this.#from = new UInt16(from) } 

  #to = new UInt16()
  get to() { return this.#to.value }
  set to(to) { this.#to = new UInt16(to) } 

  constructor({ size, from, to } = {}) {
    this.size = size
    this.from = from
    this.to = to
  }

  get positions() { return [
    0, 0, // [0] left-top
    1, 0, // [1] right-top
    1, 1, // [2] right-bottom
    0, 0, // [0] left-top
    1, 1, // [2] right-bottom
    0, 1, // [3] left- bottom
  ]}

  toJSON() { return {
    size: this.size,
    from: this.from,
    to: this.to,
  }}
}