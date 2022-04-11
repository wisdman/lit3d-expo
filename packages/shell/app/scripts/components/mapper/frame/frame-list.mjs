
import { flatIterator, filterUndefined } from "/common/types/utils.mjs"
import { FrameList as EntitiesFrameList } from "/common/entities/frame-list.mjs"

import { Frame } from "./frame.mjs"

export class FrameList extends EntitiesFrameList {
  #gl = undefined

  constructor(gl, ...args) {
    super()
    this.#gl = gl
    const items = [...flatIterator(filterUndefined(args))]
    for (const item of items) {
      if (item instanceof this.type) { this.add(item) }
      else { this.new(item) }
    }
  }

  new(args = {}) {
    const item = new Frame(this.#gl, { id: this.id, ...args })
    super.add(item)
    return item
  }

  delete(item) {
    if (super.delete(item)) {
      item.delete()
    }
  }
}