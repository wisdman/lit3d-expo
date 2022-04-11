
import { 
  // ColorTexture as EntitiesColorTexture,
  ColorTexture as EntitiesColorTexture,
  MaskTexture  as EntitiesMaskTexture,
  UrlTexture   as EntitiesUrlTexture,
} from "/common/entities/texture.mjs"

const GLTextureMixin = (Base) => class GLTexture extends Base {
  #gl = undefined

  #internalformat = undefined
  #width = undefined
  #height = undefined
  #format = undefined
  #type = undefined

  #texture = undefined

  constructor(gl, internalformat, width, height, format, type, pixels, ...args) {
    super(...args)
    this.#gl = gl

    this.#internalformat = internalformat
    this.#width = width
    this.#height = height
    this.#format = format
    this.#type = type

    this.#texture = this.#gl.createTexture()
    this.#gl.activeTexture(this.#gl.TEXTURE0 + this.id)
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#gl.CLAMP_TO_EDGE)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#gl.CLAMP_TO_EDGE)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#gl.LINEAR)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#gl.LINEAR)

    this.#gl.texImage2D(
      this.#gl.TEXTURE_2D,  // target type
      0,                    // specifying the level of detail
      this.#internalformat, // internal texture format
      this.#width,          // texture width
      this.#height,         // texture height
      0,                    // texture border. Deprecated. Must be 0.
      this.#format,         // format of the texel data
      this.#type,           // 8 bits per channel for gl.RGBA
      pixels,               // texture data
    )
  }

  update() {
    const source = this.source
    if (!source) return

    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture)
    this.#gl.texImage2D(
      this.#gl.TEXTURE_2D,  // target type
      0,                    // specifying the level of detail
      this.#internalformat, // internal texture format
      this.#format,         // format of the texel data
      this.#type,           // 8 bits per channel for gl.RGBA
      source,               // texture data source
    )
  }

  remove() {
    this.#gl.deleteTexture(this.#texture)
  }
}

export class ColorTexture extends GLTextureMixin(EntitiesColorTexture) {
  static isThisTexture(args) { return super.isThisTexture(args) }

  get source() { return new Uint8Array(this.color) }
  update = () => {}

  constructor(gl, args = {}) {
    // TODO: Fix color texture
    super(gl, gl.RGB, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0]), args)
    // super.update()
  }
}

export class MaskTexture extends GLTextureMixin(EntitiesMaskTexture) {
  static isThisTexture(args) { return super.isThisTexture(args) }

  constructor(gl, args = {}) {
    super(gl, gl.LUMINANCE, 2, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([0, 255]), args)
  }
}

class UrlTexture extends GLTextureMixin(EntitiesUrlTexture) { 
  static cache = new Map()

  static async fetch(url) {
    if (!this.cache.has(url)) {
      const blob = await (await fetch(url, { method: "GET", cache: "no-cache" })).blob()
      const data = URL.createObjectURL(blob)
      this.cache.set(url, data)
    }
    return this.cache.get(url)
  }

  static clean() { this.cache.clear() }

  update = () => {}

  constructor(gl, args = {}) {
    super(gl, gl.RGB, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0]), args)
  }
}

const EXT_RX = /\.(?<ext>[^\.]+)$/

const VIDEO_EXT = ["mkv", "mp4", "webm"]
export class VideoTexture extends UrlTexture {
  static isThisTexture({ url } = {}) { return VIDEO_EXT.includes(EXT_RX.exec("." + url)?.groups?.ext) }
  #video = document.createElement("video")
  get source() { return this.#video }

  play() {
    this.#video.currentTime = 0
    this.#video.play()
  }
  pause() { this.source.pause() }

  constructor(...args) {
    super(...args)
    this.#video.controls = false
    this.#video.autoplay = false
    this.#video.volume = this.volume
    this.#video.muted = this.muted
    this.#video.loop = true
    this.#init()
  }

  #init = async () => {
    this.#video.addEventListener("canplaythrough", () => this.update = () => super.update())
    this.#video.src = await VideoTexture.fetch(this.url)
  }
}

const IMAGE_EXT = ["avif", "jpg", "jpeg", "png", "webp"]
export class ImageTexture extends UrlTexture {
  static isThisTexture({ url } = {}) { return IMAGE_EXT.includes(EXT_RX.exec("." + url)?.groups?.ext) }
  #image = new Image()
  get source() { return this.#image }

  constructor(...args) {
    super(...args)
    this.#init()
  }

  #init = () => {
    this.#image.addEventListener("load", () => super.update())
    this.#image.src = this.url
  }
}
