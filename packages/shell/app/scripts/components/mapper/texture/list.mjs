
import { ColorTexture } from "./texture-color.mjs"
import { ImageTexture } from "./texture-image.mjs"
import { MaskTexture } from "./texture-mask.mjs"
import { VideoTexture } from "./texture-video.mjs"

const EXT_RX = /\.(?<ext>[^\.]+)$/

export class List extends EventTarget {
  #gl = undefined

  #max = 0
  get max() { return this.#max }

  #list = []
  get next() {
    for (let i = 0, max = this.#max; i < max; i++) {
      if (!this.#list.find(t => t.id === i)) return i
    }
    throw new Error("Too many textures")
  }
  get length() { return this.#list.length }

  play = () => this.#list.forEach(t => t.play?.())
  pause = () => this.#list.forEach(t => t.pause?.())

  constructor(gl) {
    super()
    this.#gl = gl
    this.#max = Math.floor(this.#gl.getParameter(this.#gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) / 2)
  }

  #change = () => this.dispatchEvent(new Event("change"))

  #newTexture = async ({ id, url, volume, mask, color } = {}) => {
    const { groups:{ ext } } = EXT_RX.exec("." + url) ?? { groups: {} }
    switch(ext) {
      case "mp4":
      case "webm":
      case "mkv":
        return await new VideoTexture(this.#gl, id ?? this.next, { url, volume })
      case "png":
      case "webp":
      case "avif":
      case "jpg":
      case "jpeg":
        return await new ImageTexture(this.#gl, id ?? this.next, { url })
    }

    if (mask) {
      return await new MaskTexture(this.#gl, id ?? this.next, { mask })
    }

    return await new ColorTexture(this.#gl, id ?? this.next, { color })
  }

  get(id) { return this.#list[id] }

  async add(options) {
    const texture = await this.#newTexture(options)
    this.#list = [...this.#list, texture]
    this.#change()
    return texture
  }

  remove(texture) {
    this.#list = this.#list.filter(t => t !== texture)
    texture.remove()
    this.#change()
  }

  clear = () => {
    this.#list = this.#list.filter(t => (t.remove(), false))
    this.#change()
  }

  load = async list => {
    this.#list = this.#list.filter(t => (t.remove(), false))
    if (!Array.isArray(list)) { return }
    for (var i = 0, l = list.length; i < l; i++) { await this.add(list[i]) }
  }

  update = () => this.#list.forEach(t => t.update())

  toJSON() { return this.#list.map(t => t.toJSON()) }
}