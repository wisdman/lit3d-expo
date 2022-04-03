
import { ExecList } from "./exec-list.mjs"
import { MappingList } from "./mapping-list.mjs"
import { SoundList } from "./sound-list.mjs"

export class Content {
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
  set description(description ="") {
    if (typeof description !== "string")
      throw new TypeError(`Mapping [set description]: "${description}" isn't string value`)
    this.#description = description
  }

  #exec = new ExecList()
  get exec() { return this.#exec }
  set exec(exec) { this.#exec = new ExecList(exec) }

  #mapping = new MappingList()
  get mapping() { return this.#mapping }
  set mapping(mapping) { this.#mapping = new MappingList(mapping) }

  #sound = new SoundList()
  get sound() { return this.#sound }
  set sound(sound) { this.#sound = new SoundList(sound) }

  constructor({ id, title, description, exec, mapping, sound } = {}) {
    this.id = id
    this.title = title
    this.description = description
    this.exec = exec
    this.mapping = mapping
    this.sound = sound
  }

  toJSON() { return {
    id: this.#id,
    title: this.#title,
    description: this.#description,
    ...(this.#exec.length ? {exec: this.#exec} : {}),
    ...(this.#mapping.length ? {mapping: this.#mapping} : {}),
    ...(this.#sound.length ? {sound: this.#sound} : {}),
  }}
}


const ctn = new Content()
console.log(JSON.stringify(ctn))