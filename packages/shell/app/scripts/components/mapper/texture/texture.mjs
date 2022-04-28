
import { 
  Texture as EntitiesTexture,
  ColorTexture as EntitiesColorTexture,
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

  delete() {
    this.#gl.deleteTexture(this.#texture)
  }
}

export class ColorTexture extends GLTextureMixin(EntitiesColorTexture) {
  static isThisTexture(args) { return super.isThisTexture(args) }

  get size() { return [1,1] }

  // get source() { return new Uint8Array(this.color) }
  update = () => {}

  constructor(gl, args = {}) {
    // console.log(args)
    super(gl, gl.RGB, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0]), args)
    // super.update()
  }
}

export class MaskTexture extends GLTextureMixin(EntitiesTexture) {
  static BuildMask = ({ size = 0, from = 0, to = 0 } = {}) => {
    if (size === 0) { return new Uint8Array([255]) }
    
    if (!Number.isInteger(size)) {  throw new TypeError(`MaskTexture [BuildMask]: Size "${size}" isn't an integer value`) }
    if (size < 0) {  throw new TypeError(`MaskTexture [BuildMask]: Size "${size}" less than zero`) }
    
    if (!Number.isInteger(from)) {  throw new TypeError(`MaskTexture [BuildMask]:  From "${from}" isn't an integer value`) }
    if (from < 0) {  throw new TypeError(`MaskTexture [BuildMask]: From "${from}" less than zero`) }
    if (from > size) {  throw new TypeError(`MaskTexture [BuildMask]: From "${from}" more than Size "${size}"`) }
    if (from > to) {  throw new TypeError(`MaskTexture [BuildMask]: From "${from}" more than To "${to}"`) }
    
    if (!Number.isInteger(to)) {  throw new TypeError(`MaskTexture [BuildMask]: To "${to}" isn't an integer value`) }
    if (to < 0) { throw new TypeError(`MaskTexture [BuildMask]: To "${to}" less than zero`) }
    if (to > size) { throw new TypeError(`MaskTexture [BuildMask]: To "${to}" more than Size "${size}"`) }

    let delta = from > 0 ? 255 / from : 0
    const left = Array.from(new Array(from), (_, i) => Math.floor(i * delta))
    const center = Array.from(new Array(to - from), (_, i) => 255)
    delta = size - to > 0 ? 255 / (size - to) : 0
    const right =  Array.from(new Array(size - to), (_, i) => Math.floor(i * delta)).reverse()
    return new Uint8Array([...left, ...center, ...right])
  }

  update = () => {}

  constructor(gl, args = {}) {
    const color = MaskTexture.BuildMask(args)
    super(gl, gl.LUMINANCE, color.length, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, color, args)
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

  get size() { return [this.#video.videoWidth, this.#video.videoHeight] }

  play() {
    this.#video.currentTime = 0
    this.#video.play()
  }
  pause() { this.source.pause() }

  constructor(...args) {
    super(...args)
    this.#video.controls = false
    this.#video.autoplay = false
    this.#video.volume = 1 // this.volume
    this.#video.muted = false // this.muted
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

  get size() { return [this.#image.naturalWidth, this.#image.naturalHeight] }

  constructor(...args) {
    super(...args)
    this.#init()
  }

  // update = () => {}

  #init = () => {
    this.#image.addEventListener("load", () => super.update())
    this.#image.src = this.url
  }
}
