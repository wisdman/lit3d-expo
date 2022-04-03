
import { IdsList } from "./ids-list.mjs"

import { Texture } from "./texture.mjs"

import { MAX_TEXTURES } from "./constants.mjs"

export class TextureList extends IdsList {
  static TYPE = Texture
  static MAX = MAX_TEXTURES
}
