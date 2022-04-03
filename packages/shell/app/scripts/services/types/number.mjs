
import { Type } from "./type.mjs"

const MIN_SYMBOL = Symbol("MIN")
const MAX_SYMBOL = Symbol("MAX")

export class TNumber extends Type {
  get min() { return this[MIN_SYMBOL] }
  get max() { return this[MAX_SYMBOL] }

  set value(value) {
    const min = this.min
    const max = this.max
    const _value = Number(value)
    if (Number.isNaN(_value)) { throw new TypeError(`TNumber: "${value}" is NaN`) }
    if (_value < min || _value > max) { throw new TypeError(`TNumber: "${value}" out of range [${min}, ${max}]`) }
    super.value = _value
  }

  constructor({
    min = -Infinity,
    max = Infinity,
  } = {}, value = 0) {
    super()

    const [_min, _max] = [Number(min), Number(max)]
    if (Number.isNaN(_min)) { throw new TypeError(`TNumber: "${min}" is incorrect minimum`) }
    if (Number.isNaN(_max)) { throw new TypeError(`TNumber: "${max}" is incorrect maximum`) }
    if (_min > _max) { throw new TypeError(`TNumber: "${min}" minimum more than "${max}" maximum`) }

    this[MIN_SYMBOL] = _min
    this[MAX_SYMBOL] = _max

    this.value = value
  }
}

export class TInt extends TNumber {
  set value(value) {
    if (value % 1 !== 0) { throw new TypeError(`TInt: "${value}" has a fractional part`) }
    super.value = value
  }

  constructor(options, value) {
    super(options)
    this.value = value
  }
}

export class Int8 extends TInt { constructor(value = 0) { super({ min = -128, max = 127 }, value) } }
export class Int16 extends TInt { constructor(value = 0) { super({ min = -(2**15), max = 2**15-1 }, value) } }
export class Int32 extends TInt { constructor(value = 0) { super({ min = -(2**31), max = 2**31-1 }, value) } }
export class Int64 extends TInt { constructor(value = 0) { super({ min = -(2**63), max = 2**63-1 }, value) } }

export class UInt8 extends TInt { constructor(value = 0) { super({ min = 0, max = 255 }, value) } }
export class UInt16 extends TInt { constructor(value = 0) { super({ min = 0, max = 2**16-1 }, value) } }
export class UInt32 extends TInt { constructor(value = 0) { super({ min = 0, max = 2**32-1 }, value) } }
export class UInt64 extends TInt { constructor(value = 0) { super({ min = 0, max = 2**64-1 }, value) } }