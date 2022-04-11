
import { UInt8 } from "../types/numeric.mjs"

export class TextureMask {
  toJSON() { return { }}
}

export class TextureColorMask extends TextureMask {
  static isLinearMask = ({ color }={}) => color !== undefined

  #color = []
  get color() { return this.#color.map(c => c.value) }
  set color(color) { this.#color = color.map(c => new UInt8(c) ) }

  constructor({ color, ...args } = {}) {
    super(args)
    this.color = color
  }

  toJSON() { return {
    ...(super.toJSON()),
    color: this.color,
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

