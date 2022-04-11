
import { Frame as BaseFrame } from "/common/entities/frame.mjs"
import { MaskTexture } from "../texture/texture.mjs"

export class Frame extends BaseFrame{
  #gl = undefined

  #maskTexture = undefined
  get maskTexture() { return this.#maskTexture }
  set maskTexture(mask) {
    this.#maskTexture?.delete()
    this.#maskTexture = new MaskTexture(this.#gl, { id: this.id, ...mask })
    this.mask = mask
  }

  constructor(gl, args = {}) {
    super(args)
    this.#gl = gl
    const { mask }= args
    this.maskTexture = mask
  }

  delete() { this.#maskTexture.delete() }
}