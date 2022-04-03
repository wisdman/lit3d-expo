
import { flatIterator, filterUndefined } from "./utils.mjs"

import { Float32, Float64, Int8, Int16, Int32, Int64, UInt8, UInt16, UInt32, UInt64 } from "./numeric.mjs"

const SYMBOL_0 = Symbol("0")
const SYMBOL_1 = Symbol("1")
const SYMBOL_2 = Symbol("2")
const SYMBOL_3 = Symbol("3")

class Vector {
  static TYPE = null
  get type() { return Object.getPrototypeOf(this).constructor.TYPE }
  
  static SIZE = 0
  get size() { return Object.getPrototypeOf(this).constructor.SIZE }

  get length() { return this.size } 

  *[Symbol.iterator]() {
    for (let i = 0, s = this.size; i < s; i++)
      yield this[i]
  }

  constructor(...args) {
    const items = [...flatIterator(filterUndefined(args))]

    const length = items.length

    if (length === 0) { // Default Vector
      for (let i = 0, s = this.size; i < s; i++)
        this[i] = new this.type()
      return this
    }

    if (length !== this.size) {
      throw new TypeError(`Vector [constructor]: Size "${length}" not equal to ${this.size}`)
    }

    for (let i = 0, s = this.size; i < s; i++)
      this[i] = items[i]
  }

  toJSON() { return [...this] }
}

class Vector2 extends Vector {  
  static SIZE = 2
 
  get [0]() { return this[SYMBOL_0].value }
  set [0](value) { this[SYMBOL_0] = new this.type(value) }

  get [1]() { return this[SYMBOL_1].value }
  set [1](value) { this[SYMBOL_1] = new this.type(value) }

  // Synonyms
  get x() { return this[0] }
  set x(value) { this[0] = value }

  get w() { return this[0] }
  set w(value) { this[0] = value }

  get width() { return this[0] }
  set width(value) { this[0] = value }

  get u() { return this[0] }
  set u(value) { this[0] = value }

  get y() { return this[1] }
  set y(value) { this[1] = value }

  get h() { return this[1] }
  set h(value) { this[1] = value }

  get height() { return this[1] }
  set height(value) { this[1] = value }

  get v() { return this[1] }
  set v(value) { this[1] = value }
}

export class Float32Vector2 extends Vector2 { static TYPE = Float32 }
export class Float64Vector2 extends Vector2 { static TYPE = Float64 }

export class Int8Vector2  extends Vector2 { static TYPE = Int8  }
export class Int16Vector2 extends Vector2 { static TYPE = Int16 }
export class Int32Vector2 extends Vector2 { static TYPE = Int32 }
export class Int64Vector2 extends Vector2 { static TYPE = Int64 }

export class UInt8Vector2  extends Vector2 { static TYPE = UInt8  }
export class UInt16Vector2 extends Vector2 { static TYPE = UInt16 }
export class UInt32Vector2 extends Vector2 { static TYPE = UInt32 }
export class UInt64Vector2 extends Vector2 { static TYPE = UInt64 }

class Vector3 extends Vector {
  static SIZE = 3

  get [0]() { return this[SYMBOL_0].value }
  set [0](value) { this[SYMBOL_0] = new this.type(value) }

  get [1]() { return this[SYMBOL_1].value }
  set [1](value) { this[SYMBOL_1] = new this.type(value) }

  get [2]() { return this[SYMBOL_2].value }
  set [2](value) { this[SYMBOL_2] = new this.type(value) }

  // Synonyms
  get x() { return this[0] }
  set x(value) { this[0] = value }

  get r() { return this[0] }
  set r(value) { this[0] = value }

  get y() { return this[1] }
  set y(value) { this[1] = value }

  get g() { return this[1] }
  set g(value) { this[1] = value }

  get z() { return this[2] }
  set z(value) { this[2] = value }

  get b() { return this[2] }
  set b(value) { this[2] = value }
}

export class Float32Vector3 extends Vector3 { static TYPE = Float32 }
export class Float64Vector3 extends Vector3 { static TYPE = Float64 }

export class Int8Vector3  extends Vector3 { static TYPE = Int8  }
export class Int16Vector3 extends Vector3 { static TYPE = Int16 }
export class Int32Vector3 extends Vector3 { static TYPE = Int32 }
export class Int64Vector3 extends Vector3 { static TYPE = Int64 }

export class UInt8Vector3  extends Vector3 { static TYPE = UInt8  }
export class UInt16Vector3 extends Vector3 { static TYPE = UInt16 }
export class UInt32Vector3 extends Vector3 { static TYPE = UInt32 }
export class UInt64Vector3 extends Vector3 { static TYPE = UInt64 }

class Vector4 extends Vector {
  static SIZE = 4

  get [0]() { return this[SYMBOL_0].value }
  set [0](value) { this[SYMBOL_0] = new this.type(value) }

  get [1]() { return this[SYMBOL_1].value }
  set [1](value) { this[SYMBOL_1] = new this.type(value) }

  get [2]() { return this[SYMBOL_2].value }
  set [2](value) { this[SYMBOL_2] = new this.type(value) }

  get [3]() { return this[SYMBOL_3].value }
  set [3](value) { this[SYMBOL_3] = new this.type(value) }

  // Synonyms
  get r() { return this[0] }
  set r(value) { this[0] = value }

  get g() { return this[1] }
  set g(value) { this[1] = value }

  get b() { return this[2] }
  set b(value) { this[2] = value }

  get a() { return this[3] }
  set a(value) { this[3] = value }
}

export class Float32Vector4 extends Vector4 { static TYPE = Float32 }
export class Float64Vector4 extends Vector4 { static TYPE = Float64 }

export class Int8Vector4  extends Vector4 { static TYPE = Int8  }
export class Int16Vector4 extends Vector4 { static TYPE = Int16 }
export class Int32Vector4 extends Vector4 { static TYPE = Int32 }
export class Int64Vector4 extends Vector4 { static TYPE = Int64 }

export class UInt8Vector4  extends Vector4 { static TYPE = UInt8  }
export class UInt16Vector4 extends Vector4 { static TYPE = UInt16 }
export class UInt32Vector4 extends Vector4 { static TYPE = UInt32 }
export class UInt64Vector4 extends Vector4 { static TYPE = UInt64 }
