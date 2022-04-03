
import { BaseConfig } from "./base.mjs"

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