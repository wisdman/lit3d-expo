
import { flatIterator, filterUndefined } from "/common/types/utils.mjs"
import { TextureList as EntitiesTextureList } from "/common/entities/texture-list.mjs"
import { ColorTexture, ImageTexture, MaskTexture, VideoTexture } from "./texture.mjs"

export class TextureList extends EntitiesTextureList {
  static GET_TEXTURE_CLASS = args => {
    if (ColorTexture.isThisTexture(args)) return ColorTexture
    if (ImageTexture.isThisTexture(args)) return ImageTexture
    if (MaskTexture.isThisTexture(args)) return MaskTexture
    if (VideoTexture.isThisTexture(args)) return VideoTexture
    throw new TypeError(`TextureList [GET_TEXTURE_CLASS]: Texture "${args}" class not detected`)
  }

  #gl = undefined

  play = () => this.forEach(t => t.play?.())
  pause = () => this.forEach(t => t.pause?.())
  update = () => this.forEach(t => t.update?.())

  constructor(gl, ...args) {
    super()
    this.#gl = gl
    const items = [...flatIterator(filterUndefined(args))]
    for (const item of items) {
      if (item instanceof this.type) { this.add(item) }
      else { this.new(item) }
    }
  }

  new(args = {}) {
    const TextureClass = this.getTextureClass(args)
    const item = new TextureClass(this.#gl, { id: this.id, ...args })
    super.add(item)
    return item
  }
}

