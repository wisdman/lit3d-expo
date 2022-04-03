import { Texture } from "./texture.mjs"

const DEFAULT_MASK = [0, 255]

export class MaskTexture extends Texture {
  #mask = undefined
  get mask() { return this.#mask }

  constructor(gl, id, {
    mask = DEFAULT_MASK,
  } = {}) {
    super(gl, gl.LUMINANCE, mask.length, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array(mask), id)
    this.#mask = mask
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      mask: this.#mask
    }
  }
}