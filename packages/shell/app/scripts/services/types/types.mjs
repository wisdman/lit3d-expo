
const MIN_SYMBOL = Symbol("MIN")
const MAX_SYMBOL = Symbol("MAX")
const REGEXP_SYMBOL = Symbol("RegExp")

class TType {
  #name = ""
  get name() { return this.#name }
  set name(name) { this.#name = String(name) }

  #value = null
  get value() { return typeof this.#value === "number" || typeof this.#value === "string" ? this.#value : null }
  set value(value) { this.#value = value }

  constructor(name) { this.name = name }

  [Symbol.toPrimitive] = (hint) => {
    switch(hint) {
      case "number":
        return typeof this.#value === "number" ? this.#value : Number(this.#value)
      case "string":
        return typeof this.#value === "string" ? this.#value : String(this.#value)
      default:
        return null
    }
  }

  toJSON = () => this.value 

  Error = (msg) => { throw new TypeError(`${this.constructor.name}${this.name ? `[${this.name}]` : ""}: ${msg}`) }
}

export class TString extends TType {
  get value() { return super.value }
  set value(value) {
    const min = this[MIN_SYMBOL]
    const max = this[MAX_SYMBOL]
    const rx = this[REGEXP_SYMBOL]

    const _value = String(value)
    const _length = _value.length
    if (_length < min || _length > max) { throw new TypeError(`TString: "${value}" out of range [${min}, ${max}]`) }
    
    if (rx && !rx.test(_value)) { this.Error(`"${value}" does not match RegExp [${rx}]`) }
    super.value = _value
  }

  constructor({
    minLength = 0,
    maxLength = Infinity,
    regexp = undefined,
  } = {}, value = "", name = "") {
    super(name)
    
    const _min = Number(minLength)
    if (Number.isNaN(_min) || _min < 0) { this.Error(`"${minLength}" is incorrect minimum`) }

    const _max = Number(maxLength)
    if (Number.isNaN(_max) || _max < 0) { this.Error(`"${maxLength}" is incorrect maximum`) }

    if (_min > _max) { this.Error(`minimum "${minLength}" more than "${maxLength}" maximum`) }

    const _regexp = typeof regexp === "string" ? new RegExp(regexp) : regexp
    if (_regexp !== undefined && !(_regexp instanceof RegExp)) { this.Error(`"${regexp}" isn't RegExp expression`) }

    this[MIN_SYMBOL] = _min
    this[MAX_SYMBOL] = _max
    this[REGEXP_SYMBOL] = _regexp

    this.value = value
  }
}


const str = new TString({
  minLength: 5,
  maxLength: 7,
  regexp: /^\d*$/,
},"123456","NAME")

console.dir(str.value)