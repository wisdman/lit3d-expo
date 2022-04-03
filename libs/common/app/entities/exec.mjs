
export class Exec {
  #id = ""
  get id() { return this.#id }
  set id(id = "") { 
    if (typeof id !== "string")
      throw new TypeError(`Exec [set id]: "${id}" isn't string value`)
    this.#id = id
  }

  #title = ""
  get title() { return this.#title }
  set title(title ="") { 
    if (typeof title !== "string")
      throw new TypeError(`Exec [set title]: "${title}" isn't string value`)
    this.#title = title
  }

  #description = ""
  get description() { return this.#description }
  set description(description = "") {
    if (typeof description !== "string")
      throw new TypeError(`Exec [set description]: "${description}" isn't string value`)
    this.#description = description
  }

  #command = ""
  get command() { return this.#command }
  set command(command = "") {
    if (typeof command !== "string")
      throw new TypeError(`Exec [set command]: "${command}" isn't string value`)
    this.#command = command
  }

  constructor({id, title, description, command} = {}) {
    this.id = id
    this.title = title
    this.description = description
    this.command = command
  }

  toJSON() { return {
    id: this.#id,
    title: this.#title,
    description: this.#description,
    command: this.#command,
  }}

}