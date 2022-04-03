
import { UInt8 } from "../types/numeric.mjs"
import { UInt8Vector3 } from "../types/vector.mjs"

import { MAX_VIOLUME } from "./constants.mjs"
import { TextureMask } from "./texture-mask.mjs"

export class Texture {
  #id = new UInt8()
  get id() { return this.#id.value }
  set id(id) { this.#id = new UInt8(id) }  

  constructor(args = {}) {
    if (UrlTexture.isUrlTexture(args)) return new UrlTexture(args)
    if (MaskTexture.isMaskTexture(args)) return new MaskTexture(args)
    if (ColorTexture.isColorTexture(args)) return new ColorTexture(args)
    const { id } = args
    this.id = id
  }

  toJSON() { return {
    id: this.#id,
  }}
}

export class UrlTexture extends Texture {
  static isUrlTexture = ({ url } = {}) => url !== undefined
  
  #url = ""
  get url() { return this.#url }
  set url(url) { this.#url = String(url) }

  #volume = new UInt8()
  get volume() { return this.#volume.value }
  set volume(volume) {
    const v = new UInt8(volume)
    if (v.value > MAX_VIOLUME)
      throw new TypeError(`Texture [set volume]: Volume "${v}" out of range [${0}..${MAX_VIOLUME}]`)
    this.#volume = v
  }
  get muted() { return this.#volume.value === 0 }

  constructor({ url, volume, ...args } = {}) {
    super(args)
    this.url = url
    this.volume = volume
  }

  toJSON() { return {
    ...(super.toJSON()),
    url: this.url,
    volume: this.volume,
  }}
}

export class MaskTexture extends Texture {
  static isMaskTexture = ({ mask } = {}) => mask !== undefined

  #mask = new TextureMask()
  get mask() { return this.#mask }
  set mask(mask) { this.#mask = new TextureMask(mask) }

  constructor({ mask, ...args } = {}) {
    super(args)
    this.mask = mask
  }

  toJSON() { return {
    ...(super.toJSON()),
    mask: this.mask,
  }}
}

export class ColorTexture extends Texture {
  static isColorTexture = ({ color } = {}) => color !== undefined

  #color = new UInt8Vector3()
  get color() { return this.#color }
  set color(color) { this.#color = new UInt8Vector3(color) }

  constructor({ color, ...args } = {}) {
    super(args)
    this.color = color
  }

  toJSON() { 
    return {
    ...(super.toJSON()),
    color: this.#color,
  }}
}
