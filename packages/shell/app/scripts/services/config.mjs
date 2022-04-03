
import { API_PATH_CONFIG } from "./api.mjs"



export class Exec extends BaseConfig {
  #id = ""
  get id() { return this.#id }
  set id(id) { this.change("id", this.#id = String(id)) }

  #title = ""
  get title() { return this.#title }
  set title(title) { this.change("title", this.#title = String(title)) }

  #command = ""
  get command() { return this.#command }
  set command(command) { this.change("command", this.#command = String(command)) }

  toJSON = () => ({
    "id": this.#id,
    "title": this.#title,
    "command": this.#command,
  })

  constructor({
    id = "",
    title = "",
    command = "",
  } = {}, root) {
    super(root)
    this.id = id
    this.title = title
    this.command = command
  }
}

export class Mapping extends BaseConfig {
  #id = ""
  get id() { return this.#id }
  set id(id) { this.change("id", this.#id = String(value)) }

  #title = ""
  get title() { return this.#title }
  set title(title) { this.change("title", this.#title = String(title)) }

  #description = ""
  get description() { return this.#description }
  set description(description) { this.change("description", this.#description = String(description)) }

  #location = [0, 0]
  get location() { return this.#location }
  set location([x = 0, y = 0] = []) { this.change("location", this.#location = [x, y]) }


}

export class Config extends BaseConfig {
  #id = ""
  get id() { return this.#id }
  set id(id) { this.change("id", this.#id = String(value)) }

  #title = ""
  get title() { return this.#title }
  set title(title) { this.change("title", this.#title = String(title)) }

  #description = ""
  get description() { return this.#description }
  set description(description) { this.change("description", this.#description = String(description)) }

  #exec = new Exec(this)
  get exec() { return this.#exec }


}