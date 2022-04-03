
import { flatIterator, filterUndefined} from "./utils.mjs"

export class List extends Set {
  static TYPE = null
  get type() { return Object.getPrototypeOf(this).constructor.TYPE }

  get length() { return this.size } 

  new = (...args) => {
    const item = new this.type(...args)
    super.add(item)
    return item
  }

  add = (item) => {
    if (!(item instanceof this.type))
      throw new TypeError(`List [add]: Item "${item}" isn't instance of "${this.type.name}"`)
    return super.add(item)
  }

  constructor(...args) {    
    super()
    const items = [...flatIterator(filterUndefined(args))]
    for (const item of items) {
      if (item instanceof this.type) { this.add(item) }
      else { this.new(item) }
    }
  }

  toJSON() { return [...this] }
}
