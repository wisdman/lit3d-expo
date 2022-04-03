
import { UInt16Vector2 } from "../types/vector.mjs"

import { getPositions } from "./utils.mjs"
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
    return getPositions([...this.cords])
  }

  constructor(...args) {
    super(args.length ? args : DEFAULT_RESOLUTION)
  }
}
