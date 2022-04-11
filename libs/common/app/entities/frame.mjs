
import { UInt8 } from "../types/numeric.mjs"

import { FindHomography } from "../math/homography.mjs"
import { ProcessVectorArray } from "../math/process.mjs"

import { FrameCorners } from "./frame-corners.mjs"
import { FrameMask } from "./frame-mask.mjs"
import { FrameSize } from "./frame-size.mjs"
import { FrameTexture } from "./frame-texture.mjs"

export class Frame {
  #id = new UInt8()
  get id() { return this.#id.value }
  set id(id) { this.#id = new UInt8(id) }

  #size = new FrameSize()
  get size() { return this.#size }
  set size(value) { this.#size = new FrameSize(value) }

  #corners = new FrameCorners()
  get corners() { return this.#corners }
  set corners(value) { this.#corners = new FrameCorners(value) }

  #texture = new FrameTexture()
  get texture() { return this.#texture }
  set texture(value) { this.#texture = new FrameTexture(value) }

  #mask = new FrameMask()
  get mask() { return this.#mask }
  set mask(value) { this.#mask = new FrameMask(value) }

  get dstPositions() {
    const homographyMatrix = FindHomography(this.#size.cords, [...this.#corners])
    return ProcessVectorArray(homographyMatrix, this.#size.positions)
  }

  get dstTextureCoords() {
    return this.#texture.positions
  }

  get dstMaskCoords() {
    return this.#mask.positions
  }

  constructor({ id, size, corners, texture, mask } = {}) {
    this.id = id
    this.size = size
    this.texture = texture
    this.mask = mask
    this.corners = corners
  }

  toJSON() { return {
    id: this.id,
    size: this.size,
    corners: this.corners,
    texture: this.texture,
    mask: this.mask,
  }}
}
