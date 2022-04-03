
export class Texture extends EventTarget {
  #gl = undefined
  
  #internalformat = undefined
  #format = undefined
  #type = undefined

  #texture = undefined

  #id = 0
  get id() { return this.#id }

  constructor(gl, internalformat, width, height, format, type, pixels, id) {
    super()
    this.#gl = gl
    
    this.#internalformat = internalformat
    this.#format = format
    this.#type = type
    
    this.#id = id
    
    this.#texture = this.#gl.createTexture()
    this.#gl.activeTexture(this.#gl.TEXTURE0 + this.#id)
    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#gl.CLAMP_TO_EDGE)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#gl.CLAMP_TO_EDGE)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#gl.LINEAR)
    this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#gl.LINEAR)

    this.#gl.texImage2D(
      this.#gl.TEXTURE_2D,  // target type
      0,                    // specifying the level of detail
      this.#internalformat, // internal texture format
      width,                // texture width
      height,               // texture height
      0,                    // texture border. Deprecated. Must be 0.
      this.#format,         // format of the texel data
      this.#type,           // 8 bits per channel for gl.RGBA
      pixels,               // texture data
    )
  }

  update() {
    const source = this.source
    if (!source) return

    this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture)
    this.#gl.texImage2D(
      this.#gl.TEXTURE_2D,  // target type
      0,                    // specifying the level of detail
      this.#internalformat, // internal texture format
      this.#format,         // format of the texel data
      this.#type,           // 8 bits per channel for gl.RGBA
      source,               // texture data source
    )
  }

  remove() {
    this.#gl.deleteTexture(this.#texture)
    this.dispatchEvent(new Event("remove"))
  }

  toJSON() {
    return {
      id: this.#id
    }
  }
}