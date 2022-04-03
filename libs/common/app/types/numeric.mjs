
class Numeric {
  static MIN = -Infinity
  static MAX = Infinity
  static INT = false

  static parseNumber(value) {
    const v = Number(value)

    if (!Number.isFinite(v))
      throw new TypeError(`Numeric [parseNumber]: "${value}" isn't finite`)

    if (this.INT && !Number.isInteger(v))
      throw new TypeError(`Numeric [parseNumber]: "${value}" isn't an Integer`)

    if (v < this.MIN || v > this.MAX)
      throw new TypeError(`Numeric [parseNumber]: "${value}" is out of range [${this.MIN}..${this.MAX}]`)

    return v
  }

  #value = 0
  get value() { return this.#value  }

  constructor(value = 0) {
    this.#value = Object.getPrototypeOf(this).constructor.parseNumber(value)
    return Object.freeze(this)
  }

  [Symbol.toPrimitive] = (hint) => hint === "number" ? this.#value : hint === "string" ? String(this.#value) : null

  toJSON() { return this.value  }
}

export class Float32 extends Numeric { 
  static MIN = -(2**127 * (2**24 - 1) / 2**23)
  static MAX = 2**127 * (2**24 - 1) / 2**23
}
export class Float64 extends Numeric {
  static MAX = -(2**1023 * (2**53 - 1) / 2**52)
  static MAX = 2**1023 * (2**53 - 1) / 2**52
}

export class Int8  extends Numeric { static MIN = -(2**7);  static MAX = 2**7-1;  static INT = true }
export class Int16 extends Numeric { static MIN = -(2**15); static MAX = 2**15-1; static INT = true }
export class Int32 extends Numeric { static MIN = -(2**31); static MAX = 2**31-1; static INT = true }
export class Int64 extends Numeric { static MIN = -(2**63); static MAX = 2**63-1; static INT = true }

export class UInt8  extends Numeric { static MIN = 0; static MAX = 2**8-1;  static INT = true }
export class UInt16 extends Numeric { static MIN = 0; static MAX = 2**16-1; static INT = true }
export class UInt32 extends Numeric { static MIN = 0; static MAX = 2**33-1; static INT = true }
export class UInt64 extends Numeric { static MIN = 0; static MAX = 2**64-1; static INT = true }
