
import { Keyboard } from "../../services/keyboard.mjs"

import { ViewProjectionMatrix } from "./math/projection.mjs"
import { ProcessVectorArray } from "./math/process.mjs"

import { DEFAULT_RESOLUTION, DEFAULT_FPS, VERTEX_SIZE, TEXTCORD_SIZE, VERTEX_COUNT, DEFAULT_SCREEN_LOACTION } from "./constants.mjs"

import { List as FrameList } from "./frame/list.mjs"
import { Editor as FrameEditor } from "./frame/editor.mjs"

import { List as TextureList } from "./texture/list.mjs"

import CSS from "./mapper.css" assert { type: "css" }

const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const VERTEX_SHADER = await (await fetch(`${CURRENT_PATH}shaders/vertex.glsl`)).text()
const FRAGMENT_SHADER = await (await fetch(`${CURRENT_PATH}shaders/fragment.glsl`)).text()

const POSITION_ATTRIBUTE_LOCATION_NAME = "a_position"
const TEXCOORD_ATTRIBUTE_LOCATION_NAME = "a_texcoord"
const TEXTURE_UNIFORM_LOCATION_NAME = "u_texture"

export class Mapper extends HTMLElement {
  static CONTEXT_ATTRIBUTES = {
    alpha: false,
    antialias: true,
    depth: false,
    desynchronized: true,
    powerPreference: "high-performance",
  }

  #id = ""
  #title = ""
  #description = ""

  #location = [...DEFAULT_SCREEN_LOACTION]

  #devicePixelRatio = 1
  #fps = DEFAULT_FPS

  #gl = this.attachShadow({mode: "open"})
            .appendChild(document.createElement("canvas"))
            .getContext("webgl2", Mapper.CONTEXT_ATTRIBUTES)

  #program = this.#gl.createProgram()
  #positionAttributeLocation = undefined
  #texcoordAttributeLocation = undefined

  #textureUniformLocation = undefined

  #vertexArray = this.#gl.createVertexArray()
  #positionBuffer = this.#gl.createBuffer()
  #texcoordBuffer = this.#gl.createBuffer()

  #frameList = new FrameList(this.#gl)
  #textureList = new TextureList(this.#gl)
  #renderFrames = []

  #viewProjectionMatrix = ViewProjectionMatrix(...DEFAULT_RESOLUTION)
  #resizeObserver = undefined

  #keyboard = new Keyboard()

  #config = {}

  constructor(config = {}) {
    super()
    this.#config = config
    this.shadowRoot.adoptedStyleSheets = [CSS]
    this.#initProgramm()
    this.#initGeometry()
    this.#initKeyboard()
  }

  #createShader = (source, type) => {
    const shader = this.#gl.createShader(type)
    this.#gl.shaderSource(shader, source)
    this.#gl.compileShader(shader)

    const compileStatus = this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)
    if (!compileStatus) {
      const lastError = this.#gl.getShaderInfoLog(shader)
      this.#gl.deleteShader(shader)
      throw new Error(`*** Error compiling shader ${type}: ${lastError}`)
    }

    return shader
  }

  #initProgramm = () => {
    const vertexShader = this.#createShader(VERTEX_SHADER, this.#gl.VERTEX_SHADER)
    this.#gl.attachShader(this.#program, vertexShader)

    const fragmentShader = this.#createShader(FRAGMENT_SHADER, this.#gl.FRAGMENT_SHADER)
    this.#gl.attachShader(this.#program, fragmentShader)

    this.#gl.linkProgram(this.#program)
    const linkStatus = this.#gl.getProgramParameter(this.#program, this.#gl.LINK_STATUS)
    if (!linkStatus) {
      const lastError = this.#gl.getProgramInfoLog(this.#program)
      throw new Error(`MAPPER Error in program linking: ${lastError}`)
    }

    this.#positionAttributeLocation = this.#gl.getAttribLocation(this.#program, POSITION_ATTRIBUTE_LOCATION_NAME)
    this.#texcoordAttributeLocation = this.#gl.getAttribLocation(this.#program, TEXCOORD_ATTRIBUTE_LOCATION_NAME)
    this.#textureUniformLocation = this.#gl.getUniformLocation(this.#program, TEXTURE_UNIFORM_LOCATION_NAME)
  }

  #initGeometry = () => {
    this.#gl.bindVertexArray(this.#vertexArray)

    this.#gl.enableVertexAttribArray(this.#positionAttributeLocation);
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#positionBuffer);
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(), this.#gl.STATIC_DRAW)
    this.#gl.vertexAttribPointer(
      this.#positionAttributeLocation,
      VERTEX_SIZE,    // vertex vector size
      this.#gl.FLOAT, // 32bit floats
      false,          // normalize
      0,              // stride
      0,              // offset
    )

    this.#gl.enableVertexAttribArray(this.#texcoordAttributeLocation)
    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#texcoordBuffer)
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(), this.#gl.STATIC_DRAW)
    this.#gl.vertexAttribPointer(
      this.#texcoordAttributeLocation,
      TEXTCORD_SIZE,  // textore cord vector size
      this.#gl.FLOAT, // 32bit floats
      true,           // normalize
      0,              // stride
      0,              // offset
    )
  }

  #updateGeometry = () => {
    const { positions, texcoords, frames } = this.#frameList
    const aPositions = ProcessVectorArray(this.#viewProjectionMatrix, positions)

    this.#gl.bindVertexArray(this.#vertexArray)

    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#positionBuffer)
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, aPositions, this.#gl.STATIC_DRAW)

    this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#texcoordBuffer)
    this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(texcoords), this.#gl.STATIC_DRAW)

    this.#renderFrames = [...frames]
  }

  #onCanvasResize = ([{contentRect: {width, height}}]) => {
    width = Math.floor(width * this.#devicePixelRatio)
    height = Math.floor(height * this.#devicePixelRatio)
    this.#gl.canvas.width = width
    this.#gl.canvas.height = height
    this.#gl.viewport(0, 0, width, height)
    this.#viewProjectionMatrix = ViewProjectionMatrix(width, height)
    this.#updateGeometry()
  }

  #render = () => {
    if (this.#textureList.length <= 0 || this.#frameList.length <= 0) {
      requestAnimationFrame(this.#render)
      return
    }

    this.#textureList.update()
    this.#gl.clearColor(0, 0, 0, 0)
    this.#gl.clear(this.#gl.COLOR_BUFFER_BIT | this.#gl.DEPTH_BUFFER_BIT)
    this.#gl.useProgram(this.#program)
    this.#gl.bindVertexArray(this.#vertexArray)
    
    for (const [i, [texId, maskId]] of this.#renderFrames.entries()) {
      this.#gl.uniform1i(this.#textureUniformLocation, texId)
      this.#gl.drawArrays(this.#gl.TRIANGLES, i * VERTEX_COUNT, VERTEX_COUNT)
    }

    setTimeout(() => requestAnimationFrame(this.#render), 1000 / this.#fps - 16)
  }

  #parseConfig = () => {

  }

  #fullscreen = async () => {
    const screens = (await window.getScreenDetails()).screens
    console.log(screens)
    // await document.body.requestFullscreen({
    //   screen: otherScreen
    // });
  }

  async connectedCallback() {
    this.#resizeObserver = new ResizeObserver(this.#onCanvasResize)
    this.#resizeObserver.observe(this.#gl.canvas)

    this.#parseConfig(this.#config)

    this.#frameList.addEventListener("change", this.#updateGeometry)
    this.#updateGeometry()

    await this.#fullscreen()

    requestAnimationFrame(this.#render)

    this.paused = false
    this.#keyboard.active = true
  }

  disconnectedCallback() {
    this.paused = true

    this.#resizeObserver.disconnect()
    this.#resizeObserver = undefined
    this.#keyboard.active = false

    this.#frameList.removeEventListener("change", this.#updateGeometry)
  }

  #initKeyboard = () => {
    this.#keyboard.on("M", this.#onMKey) // Mapper mode
    this.#keyboard.on("P", this.#onPKey) // Play cintent (Shift pause)
  }

  #onMKey = async () => {
    this.#keyboard.active = false
    const width = this.#gl.canvas.width
    const height = this.#gl.canvas.height
    const frameEditor = new FrameEditor(this.#frameList, this.#textureList, [width, height])
    await this.shadowRoot.appendChild(frameEditor).wait()
    this.shadowRoot.removeChild(frameEditor)
    this.#keyboard.active = true
  }

  #onPKey = ({shift}) => shift ? this.#textureList.pause() : this.#textureList.play()

  toJSON = () => ({
    id: this.#id,
    title: this.#title,
    description: this.#description,
    location: this.#location,
    frames: this.#frameList,
    textures: this.#textureList,
  })
}

customElements.define("ss-mapper", Mapper)