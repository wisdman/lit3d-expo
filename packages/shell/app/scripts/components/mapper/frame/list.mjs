
import { MAX_FRAMES } from "../constants.mjs"

import { Frame } from "./frame.mjs"

export class List extends EventTarget {
  #list = []
  get next() {
    for (let i = 0; i < MAX_FRAMES; i++) {
      if (!this.#list.find(f => f.id === i)) return i
    }
    throw new Error("Too many frames")
  }
  get length() { return this.#list.length }

  #change = () => this.dispatchEvent(new Event("change"))

  get(id) { return this.#list[id] }

  add() {
    const frame = new Frame(this.next)
    frame.addEventListener("change", this.#change)
    this.#list = [...this.#list, frame]
    this.#change()
    return frame
  }

  remove(frame) {
    this.#list = this.#list.filter(f => f !== frame)
    frame.removeEventListener("change", this.#change)
    this.#change()
  }

  clear = () => {
    this.#list = this.#list.filter(f => (f.remove(), false))
    this.#change()
  }

  load = list => {
    this.#list = this.#list.filter(f => (f.remove(), false))
    if (!Array.isArray(list)) { return }
    
    this.#list = list.map(data => {
      const frame = new Frame(data.id ?? this.next, data)
      frame.addEventListener("change", this.#change)
      return frame
    })
    this.#change()
  }

  get positions() { return this.#list.reduce((acc, {dstPositions}) => [...acc, ...dstPositions], []) }

  get texcoords() { return this.#list.reduce((acc, {dstTexcoords}) => [...acc, ...dstTexcoords], []) }

  get frames() { return this.#list.reduce((acc, {textureId, maskId}) => [...acc, [textureId, maskId]], []) }

  toJSON() { return this.#list.map(f => f.toJSON()) }
}