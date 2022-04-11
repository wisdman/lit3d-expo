
import { List } from "../types/list.mjs"

export class IdsList extends List {
  static MIN = 0
  get min() { return Object.getPrototypeOf(this).constructor.MIN }

  static MAX = 0
  get max() { return Object.getPrototypeOf(this).constructor.MAX }

  get ids() { return [...this].map(f => f.id) }

  get id() {
    const ids = this.ids
    for (let i = this.min, max = this.max; i < max; i++) {
      if (!ids.includes(i)) { return i }
    }
    throw new Error(`IdsList [id]: Not in range [${this.min()}..${this.max()}]`)
  }

  new(args = {}) {
    return super.new({ id: this.id, ...args })
  }

  add(item) {
    if (this.ids.includes(item.id)) 
      throw new TypeError(`IdsList [add]: Item id "${id}" is already exists`)
    super.add(item)
  }

  get({ id: value } = {}) { return this.find(({id}) => id === value) }
}
