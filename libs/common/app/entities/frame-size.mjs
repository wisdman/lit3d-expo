
import { flatIterator, filterUndefined } from "../types/utils.mjs"

import { UInt16Vector2 } from "../types/vector.mjs"

import { DEFAULT_RESOLUTION } from "./constants.mjs"

export class FrameSize extends UInt16Vector2 {
  get cords() {
    const [w, h] = this
    return [
      0, 0 , // [0] left-top
      w, 0 , // [1] right-top
      w, h , // [2] right-bottom
      0, h , // [3] left- bottom
    ]
  }

  get positions() {
    const cords = this.cords
    return [
      cords[0 * 2 + 0], cords[0 * 2 + 1], 0, 1, // [0] left-top
      cords[1 * 2 + 0], cords[1 * 2 + 1], 0, 1, // [1] right-top
      cords[2 * 2 + 0], cords[2 * 2 + 1], 0, 1, // [2] right-bottom

      cords[0 * 2 + 0], cords[0 * 2 + 1], 0, 1, // [0] left-top
      cords[2 * 2 + 0], cords[2 * 2 + 1], 0, 1, // [2] right-bottom
      cords[3 * 2 + 0], cords[3 * 2 + 1], 0, 1, // [3] left- bottom
    ]
  }

  constructor(...args) {
    const items = [...flatIterator(filterUndefined(args))]
    super(items.length ? items : DEFAULT_RESOLUTION)
  }
}
