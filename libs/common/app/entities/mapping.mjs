
import { UInt8 } from "../types/numeric.mjs"

import { flatIterator } from "../types/utils.mjs"
import { Int16Vector2 } from "../types/vector.mjs"

import { FrameList } from "./frame-list.mjs"
import { TextureList } from "./texture-list.mjs"

import { DEFAULT_FPS } from "./constants.mjs"


export class Mapping {
  #id = ""
  get id() { return this.#id }
  set id(id = "") { 
    if (typeof id !== "string")
      throw new TypeError(`Mapping [set id]: "${id}" isn't string value`)
    this.#id = id
  }

  #title = ""
  get title() { return this.#title }
  set title(title = "") { 
    if (typeof title !== "string")
      throw new TypeError(`Mapping [set title]: "${title}" isn't string value`)
    this.#title = title
  }

  #description = ""
  get description() { return this.#description }
  set description(description = "") {
    if (typeof description !== "string")
      throw new TypeError(`Mapping [set description]: "${description}" isn't string value`)
    this.#description = description
  }

  #location = new Int16Vector2()
  get location() { return this.#location }
  set location(location) { this.#location = new Int16Vector2(location) }

  #frames = new FrameList()
  get frames() { return this.#frames }
  set frames(frames) { this.#frames = new FrameList(frames) }

  #textures = new TextureList()
  get textures() { return this.#textures }
  set textures(textures) { this.#textures = new TextureList(textures) }

  #fps = new UInt8(DEFAULT_FPS)
  get fps() { return this.#fps.value }
  set fps(fps) { this.#fps = new UInt8(fps) }

  #sync = new Array()
  get sync() { return [...this.#sync] }
  set sync(values = []) { this.#sync = [...flatIterator(values)].map(v => String(v)) }

  constructor({ id, title, description, location, frames, textures, sync } = {}) {
    this.id = id
    this.title = title
    this.description = description
    this.location = location
    this.frames = frames
    this.textures = textures
    this.sync = sync
  }

  toJSON() { return {
    id: this.#id,
    title: this.#title,
    description: this.#description,
    location: this.#location,
    ...(this.#frames.length ? {frames: this.#frames} : {}),
    ...(this.#textures.length ? {textures: this.#textures} : {}),
    ...(this.#fps ? {fps:this.#fps} : {}),
    ...(this.#sync.length ? {sync: [...this.#sync] } : {}),
  }}
}
