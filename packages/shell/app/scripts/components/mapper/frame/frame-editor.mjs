
import { Keyboard } from "../../../services/keyboard.mjs"
import { DEFAULT_RESOLUTION } from "/common/entities/constants.mjs"

import { TextureEditor } from "../texture/texture-editor.mjs"

import { TextureDialog } from "./dialog-texture.mjs"

import CSS from "./frame-editor.css" assert { type: "css" }

const SVG_NAMESPACE = "http://www.w3.org/2000/svg"

const MODE_EMPTY   = ""
const MODE_FRAME   = "FRAME"
const MODE_CORNER  = "CORNER"
const MODE_TEXTURE = "TEXTURE"
const MODE_MASK    = "MASK"

export class FrameEditor extends HTMLElement {
  static CORNER_RADIUS = 10

  static Path([x1, y1, x2, y2, x3, y3, x4, y4], isActive) {
    const d = `M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} L${x4} ${y4} Z`
    const path = document.createElementNS(SVG_NAMESPACE, "path")
    path.setAttributeNS(null, "d", d)
    if (isActive) path.classList.add("active")
    return path
  }

  static Corner([cx, cy], isActive) {
    const circle = document.createElementNS(SVG_NAMESPACE, "circle")
    circle.setAttributeNS(null, "cx", cx)
    circle.setAttributeNS(null, "cy", cy)
    circle.setAttributeNS(null, "r", this.CORNER_RADIUS)
    if (isActive) circle.classList.add("active")
    return circle
  }

  static Mask([x1, y1, x2, y2]) {
    const d = `M${x1} ${y1} L${x2} ${y2}`
    const path = document.createElementNS(SVG_NAMESPACE, "path")
    path.setAttributeNS(null, "d", d)
    path.classList.add("mask")
    return path
  }

  static Text([x1, y1, x2, y2, x3, y3, x4, y4], textData = "") {
    const minX = Math.min(x1,x2,x3,x4)
    const maxX = Math.max(x1,x2,x3,x4)
    const x = minX + (maxX - minX) / 2

    const minY = Math.min(y1,y2,y3,y4)
    const maxY = Math.max(y1,y2,y3,y4)
    const y = minY + (maxY - minY) / 2  

    const text = document.createElementNS(SVG_NAMESPACE, "text")
    text.setAttributeNS(null, "x", x)
    text.setAttributeNS(null, "y", y)
    text.setAttributeNS(null, "text-anchor", "middle")
    text.innerHTML = textData
    return text
  }

  #textureDialog = undefined

  #SHORTCUTS = {
    // Mapping mode

    ["1"]: this.selectFrame.bind(this, 1), // Select frame 1
    ["2"]: this.selectFrame.bind(this, 2), // Select frame 2
    ["3"]: this.selectFrame.bind(this, 3), // Select frame 3
    ["4"]: this.selectFrame.bind(this, 4), // Select frame 4
    ["5"]: this.selectFrame.bind(this, 5), // Select frame 5
    ["6"]: this.selectFrame.bind(this, 6), // Select frame 6
    ["7"]: this.selectFrame.bind(this, 7), // Select frame 7
    ["8"]: this.selectFrame.bind(this, 8), // Select frame 8
    ["9"]: this.selectFrame.bind(this, 9), // Select frame 9
    ["0"]: this.selectFrame.bind(this, 0), // Select frame 10

    ["CTRL+1"]: this.selectFrame.bind(this, 11), // Select frame 11
    ["CTRL+2"]: this.selectFrame.bind(this, 12), // Select frame 12
    ["CTRL+3"]: this.selectFrame.bind(this, 13), // Select frame 13
    ["CTRL+4"]: this.selectFrame.bind(this, 14), // Select frame 14
    ["CTRL+5"]: this.selectFrame.bind(this, 15), // Select frame 15
    ["CTRL+6"]: this.selectFrame.bind(this, 16), // Select frame 16
    ["CTRL+7"]: this.selectFrame.bind(this, 17), // Select frame 17
    ["CTRL+8"]: this.selectFrame.bind(this, 18), // Select frame 18
    ["CTRL+9"]: this.selectFrame.bind(this, 19), // Select frame 19
    ["CTRL+0"]: this.selectFrame.bind(this, 20), // Select frame 20

    ["A"]: this.addFrame,    // Add frame

    [`P`]: this.playAll,        // Play frame content
    [`SHIFT+P`]: this.pauseAll, // Pause frame content

    ["ESCAPE"]: this.close, // Close frame editor
    
    // Frame mode

    [`[${MODE_FRAME}]1`]: this.selectCorner.bind(this, 1), // Top-left
    [`[${MODE_FRAME}]2`]: this.selectCorner.bind(this, 2), // Top-Right
    [`[${MODE_FRAME}]3`]: this.selectCorner.bind(this, 3), // Bottom-Right
    [`[${MODE_FRAME}]4`]: this.selectCorner.bind(this, 4), // Bottom-Left
    
    [`[${MODE_FRAME}]T`]: this.setTexture,    // Set frame texture

    [`[${MODE_FRAME}]D`]: this.deleteFrame, // Delete frame

    [`[${MODE_FRAME}]P`]: this.play,        // Play frame content
    [`[${MODE_FRAME}]SHIFT+P`]: this.pause, // Pause frame content

    [`[${MODE_FRAME}]SHIFT+R`]: this.resizeFrame, // Reset frame
    
    [`[${MODE_FRAME}]SHIFT+T`]: this.editTexture, // Edit texture
    [`[${MODE_FRAME}]SHIFT+M`]: this.editMask,    // Edit mask

    [`[${MODE_FRAME}]ARROWLEFT`]: this.moveFrameLeft,       // Move frame left
    [`[${MODE_FRAME}]SHIFT+ARROWLEFT`]: this.moveFrameLeft, // Move frame left x10

    [`[${MODE_FRAME}]ARROWRIGHT`]: this.moveFrameRight,       // Move frame right
    [`[${MODE_FRAME}]SHIFT+ARROWRIGHT`]: this.moveFrameRight, // Move frame right x10

    [`[${MODE_FRAME}]ARROWUP`]: this.moveFrameUp,       // Move frame up
    [`[${MODE_FRAME}]SHIFT+ARROWUP`]: this.moveFrameUp, // Move frame up x10

    [`[${MODE_FRAME}]ARROWDOWN`]: this.moveFrameDown,       // Move frame down
    [`[${MODE_FRAME}]SHIFT+ARROWDOWN`]: this.moveFrameDown, // Move frame down x10

    [`[${MODE_FRAME}]ESCAPE`]: this.deselectFrame, // Deselect frame

    // Corner mode

    [`[${MODE_CORNER}]1`]: this.selectCorner.bind(this, 1), // Top-left
    [`[${MODE_CORNER}]2`]: this.selectCorner.bind(this, 2), // Top-Right
    [`[${MODE_CORNER}]3`]: this.selectCorner.bind(this, 3), // Bottom-Right
    [`[${MODE_CORNER}]4`]: this.selectCorner.bind(this, 4), // Bottom-Left

    [`[${MODE_CORNER}]ARROWLEFT`]: this.moveCornerLeft,       // Move corner left
    [`[${MODE_CORNER}]SHIFT+ARROWLEFT`]: this.moveCornerLeft, // Move corner left x10

    [`[${MODE_CORNER}]ARROWRIGHT`]: this.moveCornerRight,       // Move corner right
    [`[${MODE_CORNER}]SHIFT+ARROWRIGHT`]: this.moveCornerRight, // Move corner right x10

    [`[${MODE_CORNER}]ARROWUP`]: this.moveCornerUp,       // Move corner up
    [`[${MODE_CORNER}]SHIFT+ARROWUP`]: this.moveCornerUp, // Move corner up x10

    [`[${MODE_CORNER}]ARROWDOWN`]: this.moveCornerDown,       // Move corner down
    [`[${MODE_CORNER}]SHIFT+ARROWDOWN`]: this.moveCornerDown, // Move corner down x10

    [`[${MODE_CORNER}]ESCAPE`]: this.deselectCorner, // Deselect corner
    
    // Texture edit mode

    [`[${MODE_TEXTURE}]H`]: this.setectPart, // Reset texture

    [`[${MODE_TEXTURE}]R`]: this.resizeTexture, // Reset texture
    [`[${MODE_TEXTURE}]SHIFT+R`]: this.resetTexture, // Reset texture

    [`[${MODE_TEXTURE}]ARROWLEFT`]: this.moveTextureLeft,       // Move texture left
    [`[${MODE_TEXTURE}]SHIFT+ARROWLEFT`]: this.moveTextureLeft, // Move texture left

    [`[${MODE_TEXTURE}]ARROWRIGHT`]: this.moveTextureRight,       // Move texture right
    [`[${MODE_TEXTURE}]SHIFT+ARROWRIGHT`]: this.moveTextureRight, // Move texture right

    [`[${MODE_TEXTURE}]ARROWUP`]: this.moveTextureUp,       // Move texture up
    [`[${MODE_TEXTURE}]SHIFT+ARROWUP`]: this.moveTextureUp, // Move texture up

    [`[${MODE_TEXTURE}]ARROWDOWN`]: this.moveTextureDown,       // Move texture down
    [`[${MODE_TEXTURE}]SHIFT+ARROWDOWN`]: this.moveTextureDown, // Move texture down

    [`[${MODE_TEXTURE}]ESCAPE`]: this.endTextureEdit, // End edit texture

    // Mask edit mode

    [`[${MODE_MASK}]R`]: this.resizeMask, // Resize mask
    [`[${MODE_MASK}]SHIFT+R`]: this.resetMask, // Reset mask

    [`[${MODE_MASK}]ARROWLEFT`]: this.moveMaskLeft,       // Move texture left
    [`[${MODE_MASK}]SHIFT+ARROWLEFT`]: this.moveMaskLeft, // Move texture left

    [`[${MODE_MASK}]ARROWRIGHT`]: this.moveMaskRight,       // Move texture right
    [`[${MODE_MASK}]SHIFT+ARROWRIGHT`]: this.moveMaskRight, // Move texture right

    [`[${MODE_MASK}]ESCAPE`]: this.endMaskEdit, // End edit mask

  }

  #keyboard = new Keyboard(this, this.#SHORTCUTS)
  
  #frameList = undefined
  get frames() { return [...this.#frameList] }

  #textureList = undefined
  get textures() { return [...this.#textureList] }
  
  #textureEditor = undefined

  #svg = this.attachShadow({mode: "open"})
             .appendChild(document.createElementNS(SVG_NAMESPACE, "svg"))

  get frames() { return [...this.#frameList] }

  #activeFrame = undefined
  get activeFrame() { return this.#activeFrame }
  set activeFrame(frame) {
    this.#activeCorner = this.#isTextureMode = this.#isMaskMode = undefined
    this.#activeFrame = this.#frameList.has(frame) ? frame : undefined  
    this.#keyboard.mode = this.#activeFrame ? MODE_FRAME : MODE_EMPTY
    this.#render()
  }

  #activeCorner = undefined
  get activeCorner() { return this.#activeCorner }
  set activeCorner(i) {
    this.#activeCorner = this.#isTextureMode = this.#isMaskMode = undefined
    if (this.#activeFrame === undefined) { 
      this.#keyboard.mode = MODE_EMPTY
      this.#render()
      return
    }
    this.#activeCorner = 0 <= i && i <= 3 ? i : undefined
    if (this.#activeCorner === undefined) {
      this.#keyboard.mode = MODE_FRAME
      this.#render()
      return 
    }
    this.#keyboard.mode = MODE_CORNER
    this.#render()
  }

  #isTextureMode = undefined
  get isTextureMode() { return this.#isTextureMode }
  set isTextureMode(value) {
    this.#activeCorner = this.#isTextureMode = this.#isMaskMode = undefined
    if (this.#activeFrame === undefined) {
      this.#keyboard.mode = MODE_EMPTY
      this.#render()
      return
    }
    this.#isTextureMode = Boolean(value)
    if (!this.#isTextureMode) {
      this.#keyboard.mode = MODE_FRAME
      this.#render()
      return
    }
    this.#keyboard.mode = MODE_TEXTURE
    this.#render()
  }

  #isMaskMode = undefined
  get isMaskMode() { return this.#isMaskMode }
  set isMaskMode(value) {
    this.#activeCorner = this.#isTextureMode = this.#isMaskMode = undefined
    if (this.#activeFrame === undefined) {
      this.#keyboard.mode = MODE_EMPTY
      this.#render()
      return
    }
    this.#isMaskMode = Boolean(value)
    if (!this.#isMaskMode) {
      this.#keyboard.mode = MODE_FRAME
      this.#render()
      return
    }
    this.#keyboard.mode = MODE_MASK
    this.#render()
  }

  #render = () => {
    this.#svg.innerHTML = ""
    for (const frame of this.frames) {
      const isActive = frame === this.#activeFrame
      this.#svg.appendChild(FrameEditor.Path(frame.corners, isActive))
      this.#svg.appendChild(FrameEditor.Corner(frame.corners[0], isActive && this.#activeCorner === 0))
      this.#svg.appendChild(FrameEditor.Corner(frame.corners[1], isActive && this.#activeCorner === 1))
      this.#svg.appendChild(FrameEditor.Corner(frame.corners[2], isActive && this.#activeCorner === 2))
      this.#svg.appendChild(FrameEditor.Corner(frame.corners[3], isActive && this.#activeCorner === 3))
      
      if (isActive && this.isTextureMode) {
        const [ w, h ] = frame.size
        this.#svg.appendChild(FrameEditor.Text(frame.corners, `${w} x ${h}`))
      } else if (isActive && this.isMaskMode) {
        const { size, from, to } = frame.mask
        this.#svg.appendChild(FrameEditor.Text(frame.corners, `${from} - ${size} - ${to}`))
      } else {
        this.#svg.appendChild(FrameEditor.Text(frame.corners, `[${frame.id + 1}${ this.#activeCorner !== undefined ? `:${this.#activeCorner + 1}` : ""}]`))
      }
      
    }
    this.dispatchEvent(new Event("render"))
  }

  constructor(frameList, textureList, [width, height] = DEFAULT_RESOLUTION) {
    super()
    this.#frameList = frameList
    this.#textureList = textureList
    this.shadowRoot.adoptedStyleSheets = [CSS]
    this.#svg.setAttributeNS(null, "width", "100%")
    this.#svg.setAttributeNS(null, "height", "100%")
    this.#svg.setAttributeNS(null, "viewBox", `0 0 ${width}, ${height}`)
  }

  selectFrame(i) { this.activeFrame = this.#frameList.get({ id: i-1 }) }
  selectCorner(i) { this.activeCorner = i - 1 }
  
  addFrame() {
    this.activeFrame = this.#frameList.new()
    this.#render()
  }
  deleteFrame() {
    this.#frameList.delete(this.activeFrame)
    this.activeFrame = undefined
    this.#render()
  }

  resizeFrame() {
    if (this.#activeFrame === undefined) { return }
    const texture = this.#textureList.get({ id: this.activeFrame.texture.id })
    if (texture === undefined) { return }
    const [w,h] = texture.size
    this.activeFrame.size = [w,h]
    this.activeFrame.texture.reset()
    this.activeFrame.corners = [0,0,w,0,w,h,0,h]
    this.#render()
  }

  async setectPart() {
    if (this.#activeFrame === undefined) { return }
    const texture = this.#textureList.get({ id: this.activeFrame.texture.id })
    if (texture === undefined) { return }
    this.#keyboard.active = false
    this.#textureDialog = this.#textureDialog ?? new TextureDialog()
    const cords = await this.#textureDialog.modal({ url: texture.url })
    if (cords !== undefined) { 
      this.#activeFrame.texture.cords = cords
      this.#render()
    }
    this.#keyboard.active = true
  }


  resetTexture() {
    if (this.#activeFrame === undefined) { return }
    const texture = this.#textureList.get({ id: this.activeFrame.texture.id })
    if (texture === undefined) { return }
    const size = texture.size
    this.activeFrame.size = size
    this.activeFrame.texture.reset()
    this.#render()
  }

  resizeTexture() {
    if (this.#activeFrame === undefined) { return }
    const texture = this.#textureList.get({ id: this.activeFrame.texture.id })
    if (texture === undefined) { return }
    const [w, h] = texture.size
    const [x1, y1] = this.activeFrame.texture[0]
    const [x2, y2] = this.activeFrame.texture[2]
    const dw = Math.round((Math.max(x1,x2) - Math.min(x1,x2)) * w)
    const dh = Math.round((Math.max(y1,y2) - Math.min(y1,y2)) * h)
    this.activeFrame.size = [dw, dh]
    this.#render()
  }

  resizeMask() {
    if (this.#activeFrame === undefined) { return }
    const [w] = this.activeFrame.size
    this.#activeFrame.maskTexture = { size: w, from: 0, to: w }
    this.#render()
  }

  resetMask() {
    if (this.#activeFrame === undefined) { return }
    this.#activeFrame.maskTexture = { size: 0, from: 0, to: 0 }
    this.#render()
  }
  
  async setTexture() {
    this.#keyboard.active = false
    this.#textureEditor = this.#textureEditor ?? new TextureEditor(this.#textureList)
    this.shadowRoot.appendChild(this.#textureEditor)
    const { texture } = await this.#textureEditor.modal()
    this.shadowRoot.removeChild(this.#textureEditor)
    if (this.activeFrame && texture !== undefined) {
      this.activeFrame.texture.id = texture
    }
    this.#render()
    this.#keyboard.active = true
  }

  async editTexture() {
    if (this.#activeFrame === undefined) { return }
    this.isTextureMode = true
  }

  editMask() {
    if (this.#activeFrame === undefined) { return }
    this.isMaskMode = true
  }

  play() { this.#textureList.get(this.activeFrame.texture)?.play?.() }
  pause() { this.#textureList.get(this.activeFrame.texture)?.pause?.() }
  playAll() { this.#textureList.play() }
  pauseAll() { this.#textureList.pause() }

  close() { this.dispatchEvent(new Event("close")) }
  
  deselectFrame() { this.activeFrame = undefined }
  deselectCorner() { this.activeCorner = undefined }
  endTextureEdit() { this.isTextureMode = false }
  endMaskEdit() { this.isMaskMode = false }

  moveFrameLeft({shift}) {
    this.activeFrame?.corners?.move(shift ? -10 : -1, 0)
    this.#render()
  }

  moveFrameRight({shift}) {
    this.activeFrame?.corners?.move(shift ? 10 : 1, 0)
    this.#render()
  }

  moveFrameUp({shift}) {
    this.activeFrame?.corners?.move(0, shift ? -10 : -1)
    this.#render()
  }

  moveFrameDown({shift}) {
    this.activeFrame?.corners?.move(0, shift ? 10 : 1)
    this.#render()
  }

  moveCornerLeft({shift}) {
    this.activeFrame?.corners?.move(this.activeCorner, shift ? -10 : -1, 0)
    this.#render()
  }

  moveCornerRight({shift}) {
    this.activeFrame?.corners?.move(this.activeCorner, shift ? 10 : 1, 0)
    this.#render()
  }

  moveCornerUp({shift}) {
    this.activeFrame?.corners?.move(this.activeCorner, 0, shift ? -10 : -1)
    this.#render()
  }

  moveCornerDown({shift}) {
    this.activeFrame?.corners?.move(this.activeCorner, 0, shift ? 10 : 1)
    this.#render()
  }

  moveTextureLeft({shift, caps}) {
    if (this.#activeFrame === undefined) { return }
    const [w] = this.#activeFrame.size
    const dx = 1/w * (caps ? 10 : 1)
    this.activeFrame?.texture?.move(shift ? 1 : 3, dx, 0)
    this.#render()
  }

  moveTextureRight({shift, caps}) {
    if (this.#activeFrame === undefined) { return }
    const [w] = this.#activeFrame.size
    const dx = -1/w * (caps ? 10 : 1)
    this.activeFrame?.texture?.move(shift ? 1 : 3, dx, 0)
    this.#render()
  }

  moveTextureUp({shift, caps}) {
    if (this.#activeFrame === undefined) { return }
    const [, h] = this.#activeFrame.size
    const dy = 1/h * (caps ? 10 : 1)
    this.activeFrame?.texture?.move(shift ? 2 : 0, 0, dy)
    this.#render()
  }

  moveTextureDown({shift, caps}) {
    if (this.#activeFrame === undefined) { return }
    const [, h] = this.#activeFrame.size
    const dy = -1/h * (caps ? 10 : 1)
    this.#activeFrame.texture?.move(shift ? 2 : 0, 0, dy)
    this.#render()
  }

  moveMaskLeft({shift}) {
    if (this.#activeFrame === undefined) { return }
    let { size, from, to } = this.#activeFrame.mask
    if (shift) { to-- } else { from-- }
    if (from < 0 ) from = 0
    if (to > size) to = size 
    this.#activeFrame.maskTexture = { size, from, to }
    this.#render()
  }

  moveMaskRight({shift}) {
    if (this.#activeFrame === undefined) { return }
    let { size, from, to } = this.#activeFrame.mask
    if (shift) { to++ } else { from++ }
    if (from < 0 ) from = 0
    if (to > size) to = size 
    this.#activeFrame.maskTexture = { size, from, to }
    this.#render()
  }

  connectedCallback() {
    this.#activeFrame = this.#activeCorner = this.#isTextureMode = this.#isMaskMode = undefined
    this.#render()
    this.#keyboard.active = true
  }

  disconnectedCallback() {
    this.#keyboard.active = false
    this.#svg.innerHTML = ""
  }

  modal = () => new Promise(resolve => this.addEventListener("close", resolve, { once: true }))
}

customElements.define("ss-mapper-frames", FrameEditor)
