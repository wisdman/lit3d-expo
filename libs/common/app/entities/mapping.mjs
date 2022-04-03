
import { flatIterator } from "../types/utils.mjs"
import { Int8Vector2 } from "../types/vector.mjs"

import { FrameList } from "./frame-list.mjs"
import { TextureList } from "./texture-list.mjs"

export class Mapping {
  #id = ""
  get id() { return this.#id }
  set id(id) { 
    if (typeof id !== "string")
      throw new TypeError(`Mapping [set id]: "${id}" isn't string value`)
    this.#id = id
  }

  #title = ""
  get title() { return this.#title }
  set title(title) { 
    if (typeof title !== "string")
      throw new TypeError(`Mapping [set title]: "${title}" isn't string value`)
    this.#title = title
  }

  #description = ""
  get description() { return this.#description }
  set description(description) {
    if (typeof description !== "string")
      throw new TypeError(`Mapping [set description]: "${description}" isn't string value`)
    this.#description = description
  }

  #location = new Int8Vector2()
  get location() { return this.#location }
  set location(location) { this.#location = new Int8Vector2(location) }

  #frames = new FrameList()
  get frames() { return this.#frames }
  set frames(frames) { this.#frames = new FrameList(frames) }

  #textures = new TextureList()
  get textures() { return this.#textures }
  set textures(textures) { this.#textures = new TextureList(textures) }

  #url = ""
  get url() { return this.#url }
  set url(url = "") { this.#url = String(url) }

  #sync = new Array()
  get sync() { return [...this.#sync] }
  set sync(values = []) { this.#sync = [...flatIterator(values)].map(v => String(v)) }

  constructor({ id, title, description, location, frames, textures, url, sync } = {}) {
    this.id = id
    this.title = title
    this.description = description
    this.location = location
    this.frames = frames
    this.textures = textures
    this.url = url
    this.sync = sync
  }

  toJSON() { return {
    id: this.#id,
    title: this.#title,
    description: this.#description,
    location: this.#location,
    ...(this.#frames.length ? {frames: this.#frames} : {}),
    ...(this.#textures.length ? {textures: this.#textures} : {}),
    ...(this.#url ? { url: this.#url } : {} ),
    ...(this.#sync.length ? {sync: [...this.#sync] } : {}),
  }}
}