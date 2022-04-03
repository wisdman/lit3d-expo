
import { BaseConfig } from "./base.mjs"


export class Frame extends BaseConfig {
  #id = 0
  get id() { return this.#id }
  set id(id) {
    id = Number.parseInt(id)
    if (Number.isFinite())

    this.change("id", this.#id = Nu(id)) }


  type Frame struct {
  Id       uint8           `json:"id"`
  Corners  [8]int16        `json:"corners"`
  Size     [2]uint16       `json:"size"`
  Textures *[]FrameTexture `json:"textures,omitempty"`
  Mask     *FrameMask      `json:"mask,omitempty"`
}
}

export class Mapping extends BaseConfig {
  #id = ""
  get id() { return this.#id }
  set id(id) { this.change("id", this.#id = String(id)) }

  #title = ""
  get title() { return this.#title }
  set title(title) { this.change("title", this.#title = String(title)) }

  #description = ""
  get description() { return this.#description }
  set description(description) { this.change("description", this.#description = String(description)) }

  #location = [0, 0]
  get location() { return this.#location }
  set location([x = 0, y = 0] = []) { this.change("location", this.#location = [x, y]) }


  // Frames   *[]Frame   `json:"frames,omitempty"`
  // Textures *[]Texture `json:"textures,omitempty"`

  // URL *string `json:"url,omitempty"`

  // Sync *[]string `json:"sync,omitempty"`

}