import { Texture } from "./texture.mjs"

import { DEFAULT_COLOR } from "../constants.mjs"

export class ColorTexture extends Texture {
  #color = undefined
  get color() { return this.#color }

  constructor(gl, id, {
    color = DEFAULT_COLOR,
  } = {}) {
    super(gl, gl.RGB, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(color), id)
    this.#color = color
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      color: this.color
    }
  }
}