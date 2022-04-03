
import { UInt16, UInt8 } from "../types/numeric.mjs"
import { UInt16Vector2 } from "../types/vector.mjs"

const ROTATE = [0, 90, 180, 360]

export class TextureMask {
  #size = new UInt16Vector2()
  get size() { return this.#size }
  set size(size) { this.#size = new UInt16Vector2(size) }

  constructor(args = {}) {
    if (TextureLinearMask.isLinearMask(args)) return new TextureLinearMask(args)
    if (TextureUrlMask.isUrlMask(args)) return new TextureUrlMask(args)
    const { size } = args
    this.size = size
  }

  toJSON() { return {
    size: this.#size,
  }}
}

export class TextureLinearMask extends TextureMask {
  static isLinearMask = ({ start, end, rotate }={}) => start !== undefined && end !== undefined && rotate !== undefined

  #start = new UInt16()
  get start() { return this.#start }
  set start(start) { this.#start = new UInt16(start) }

  #end = new UInt16()
  get end() { return this.#end }
  set end(start) { this.#end = new UInt16(end) }

  #rotate = new UInt8()
  get rotate() { return this.#rotate.value }
  set rotate(rotate) { 
    if (!ROTATE.includes(rotate))
      throw new TypeError(`TextureLinearMask [set rotate]: Value "${rotate}" not in [${ROTATE.join()}]`)
    this.#rotate = new UInt8(rotate)
  }

  constructor({ start, end, rotate, ...args } = {}) {
    super(args)
    this.start = start
    this.end = end
    this.rotate = rotate
  }

  toJSON() { return {
    ...(super.toJSON()),
    start: this.start,
    end: this.end,
    rotate: this.rotate,
  }}
}

export class TextureUrlMask extends TextureMask {
  static isUrlMask = ({ url } = {}) => url !== undefined
  
  #url = ""
  get url() { return this.#url }
  set url(url) { this.#url = String(url) }

  constructor({ url, ...args } = {}) {
    super(args)
    this.url = url
  }

  toJSON() { return {
    ...(super.toJSON()),
    url: this.url,
  }}
}

