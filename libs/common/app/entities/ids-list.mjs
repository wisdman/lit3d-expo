
import { List } from "../types/list.mjs"

export class IdsList extends List {
  static MAX = 0
  get max() { return Object.getPrototypeOf(this).constructor.TYPE }

  get ids() { return [...this].map(f => f.id) }

  get id() {
    const ids = this.ids
    for (let i = 0; i < FrameList.MAX; i++) {
      if (!ids.includes(i)) { return i }
    }
    throw new Error(`IdsList [id]: Too many ids, max ${IdsList.MAX}`)
  }

  new = (...args) => super.new({ id: this.id, ...args })

  add = (item) => {
    const {id} = item
    if (ids.includes(id)) 
      throw new TypeError(`IdsList [add]: Item id "${id}" is already exists`)
    super.add(item)
  }
}