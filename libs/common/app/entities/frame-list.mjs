
import { IdsList } from "./ids-list.mjs"

import { Frame } from "./frame.mjs"
import { MAX_FRAMES } from "../constants.mjs"

export class FrameList extends IdsList {
  static TYPE = Frame
  static MAX = MAX_FRAMES

  get dstPositions() { return [...this].reduce((acc, {dstPositions}) => [...acc, ...dstPositions], []) }
  get dstTextureCoords() { return [...this].reduce((acc, {dstTextureCoords}) => [...acc, ...dstTextureCoords], []) }
  get dstMaskCoords() { return [...this].reduce((acc, {dstMaskCoords}) => [...acc, ...dstMaskCoords], []) }

  get frames() { return [...this].reduce((acc, {texture:{id:texId},mask:{id:maskId}}) => [...acc, [texId, maskId]], []) }
}
