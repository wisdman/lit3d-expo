
export class Exec {
  #id = ""
  get id() { return this.#id }
  set id(id) { 
    if (typeof id !== "string")
      throw new TypeError(`Exec [set id]: "${id}" isn't string value`)
    this.#id = id
  }

  #title = ""
  get title() { return this.#title }
  set title(title) { 
    if (typeof title !== "string")
      throw new TypeError(`Exec [set title]: "${title}" isn't string value`)
    this.#title = title
  }

  #command = ""
  get command() { return this.#command }
  set command(command) {
    if (typeof command !== "string")
      throw new TypeError(`Exec [set command]: "${command}" isn't string value`)
    this.#command = command
  }

  constructor({id, title, command} = {}) {
    this.id = id
    this.title = title
    this.command = command
  }

  toJSON() { return {
    id: this.#id,
    title: this.#title,
    command: this.#command,
  }}

}