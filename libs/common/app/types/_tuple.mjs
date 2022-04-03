
import { isClass } from "./utils.mjs"

export class Tuple extends Array {
  #types = []

  get size() { return this.length }

  #set = (target, prop, item) => {
    if (prop === "length")
      throw new TypeError(`Tuple [set]: Propperty "${prop}" is read only`)

    const id = ~~prop
    if (!Number.isInteger(id))
      throw new TypeError(`Tuple [set]: Propperty "${prop}" isn't Integer`)

    const max = this.#classes.length - 1
    if (id < 0 || id > max)
      throw new TypeError(`Tuple [set]: Index "${prop}" is out of range [${0}..${max}]`)

    const type = this.#types[id]
    if (!(item instanceof this.#types[id]))
      throw new TypeError(`Tuple [set]: Item "${item}" isn't instance of "${type.name}"`)

    target[id] = item
    return true
  }

  #handler = { set: this.#set }

  constructor(...items) {
    if (items.length === 1 && items[0] instanceof Array)
      return new Tuple(...items[0])

    if (items.length === 0) {
      throw new TypeError(`Tuple [constructor]: Size "${items.length}" equal to zero`)
    }

    super(items)
    
    this.#types = items.map(item => {
      const type = item.constructor
      if (!isClass(type))
        throw new TypeError(`Tuple [constructor]: Item "${item}" type "${type}" isn't class`)
      return type
    })

    return new Proxy(this, this.#handler)
  }
}
