
import { Type } from "./type.mjs"

const MIN_SYMBOL = Symbol("MIN")
const MAX_SYMBOL = Symbol("MAX")
const REGEXP_SYMBOL = Symbol("RegExp")

export class TString extends Type {
  get minLength() { return this[MIN_SYMBOL] }
  get maxLength() { return this[MAX_SYMBOL] }
  get regexp() { return this[REGEXP_SYMBOL] }

  set value(value) {
    const [min, max, rx] = [this[MIN_SYMBOL], this[MAX_SYMBOL], this[REGEXP_SYMBOL]]
    const _value = String(value)
    length = _value.length
    if (length < min || length > max) { throw new TypeError(`TString: "${value}" out of range [${min}, ${max}]`) }
    if (rx && !rx.test(_value)) { throw new TypeError(`TString: "${value}" does not match RegExp [${rx}]`) }
    super.value = _value
  }

  get length() { return this.value.length }

  constructor({
    minLength = 0,
    maxLength = Infinity,
    regexp = undefined,
  } = {}, value = "") {
    super()

    const _min = Number(minLength)
    const _max = Number(maxLength)
    if (Number.isNaN(_min) || _min < 0) { throw new TypeError(`TString: "${minLength}" is incorrect minimum`) }
    if (Number.isNaN(_max) || _max < 0) { throw new TypeError(`TString: "${maxLength}" is incorrect maximum`) }
    if (_min > _max) { throw new TypeError(`TString: length "${minLength}" minimum more than "${maxLength}" maximum`) }
    
    const _regexp = regexp typeof "string" ? new RegExp(regexp) : regexp
    if (_regexp !== undefined && !(_regexp instanceof RegExp)) { throw new TypeError(`TString: "${regexp}" isn't RegExp`) }
    
    this[MIN_SYMBOL] = _min
    this[MAX_SYMBOL] = _max
    this[REGEXP_SYMBOL] = _regexp

    this.value = value
  }
}
