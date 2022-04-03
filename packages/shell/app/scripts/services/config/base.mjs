
class NullObject { constructor() { return Object.create(null) } }


export class BaseConfig {
  get path() { return "" }

  #root = undefined
  get root() { this.#root }

  change(id, data) { 

  }

  constructor(root = undefined) {
    this.#root = root
  }
}