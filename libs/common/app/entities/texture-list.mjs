
import { IdsList } from "./ids-list.mjs"

import { Texture, UrlTexture, ColorTexture } from "./texture.mjs"

import { MAX_FRAMES, MAX_TEXTURES } from "./constants.mjs"

export class TextureList extends IdsList {
  static TYPE = Texture
  static MIN = MAX_FRAMES + 1
  static MAX = MAX_TEXTURES

  static GET_TEXTURE_CLASS = args => {
    if (UrlTexture.isThisTexture(args)) return UrlTexture
    if (ColorTexture.isThisTexture(args)) return ColorTexture
    return Texture
  }

  getTextureClass(args) { return Object.getPrototypeOf(this).constructor.GET_TEXTURE_CLASS(args) }

  new(args = {}) {
    const TextureClass = this.getTextureClass(args)
    const item = new TextureClass({ id: this.id, ...args })
    super.add(item)
    return item
  }
}
