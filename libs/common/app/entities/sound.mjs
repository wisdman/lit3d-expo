
import { UInt8, UInt16 } from "../types/numeric.mjs"

import { MAX_VIOLUME } from "./constants.mjs"

export class Sound {
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

  #url = ""
  get url() { return this.#url }
  set url(url = "") { this.#url = String(url) }

  #volume = new UInt8()
  get volume() { return this.#volume.value }
  set volume(volume) {
    const v = new UInt8(volume)
    if (v.value > MAX_VIOLUME)
      throw new TypeError(`Sound [set volume]: Volume "${v}" out of range [${0}..${MAX_VIOLUME}]`)
    this.#volume = v
  }
  get muted() { return this.#volume.value === 0 }

  #loop = false
  get loop() { return this.#loop }
  set loop(loop) { this.#loop = !!loop }

  #timer = new UInt16()
  get timer() { return this.#timer.value }
  set timer(timer) { this.#timer = new UInt16(timer) }

  #sync = new Array()
  get sync() { return [...this.#sync] }
  set sync(values = []) { this.#sync = [...flatIterator(values)].map(v => String(v)) }

  constructor({ id, title, description, url, volume, loop, timer, sync } = {}) {
    this.id = id
    this.title = title
    this.description = description
    this.url = url
    this.volume = volume
    this.loop = loop
    this.timer = timer
    this.sync = sync
  }

  toJSON() { return {
    id: this.#id,
    title: this.#title,
    description: this.#description,
    url: this.#url,
    volume: this.#volume,
    ...(this.#loop ? { loop: true } : {}),
    ...(this.#timer.value > 0 ? {timer: this.#timer.value } : {}),
    ...(this.#sync.length ? {sync: [...this.#sync] } : {}),
  }}
}