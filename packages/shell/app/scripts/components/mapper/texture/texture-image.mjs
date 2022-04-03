import { Texture } from "./texture.mjs"

export class ImageTexture extends Texture {
  #image = new Image()
  get source() { return this.#image }

  #url = undefined
  get url() { return this.#url }

  constructor(gl, id, { 
    url = undefined
  } = {}) {
    super(gl, gl.RGB, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0]), id)
    this.#url = url

    return new Promise(resolve => {
      this.#image.addEventListener("load", () => {
        super.update()
        resolve(this)
      })
      this.#image.src = this.#url
    })
  }

  update() {}

  toJSON() {
    return {
      ...super.toJSON(),
      url: this.#url
    }
  }
}