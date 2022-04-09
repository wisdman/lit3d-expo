
import { Keyboard } from "../../../services/keyboard.mjs"
import { DEFAULT_RESOLUTION } from "/common/entities/constants.mjs"

import { TextureEditor } from "../texture/texture-editor.mjs"
import { MaskTexture } from "../texture/texture.mjs"

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
    
    [`[${MODE_FRAME}]R`]: this.setResolution, // Set frame resolution
    [`[${MODE_FRAME}]T`]: this.setTexture,    // Set frame texture
    [`[${MODE_FRAME}]M`]: this.setMask,       // Set frame mask

    [`[${MODE_FRAME}]D`]: this.deleteFrame, // Delete frame

    [`[${MODE_FRAME}]P`]: this.play,        // Play frame content
    [`[${MODE_FRAME}]SHIFT+P`]: this.pause, // Pause frame content
    
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

    [`[${MODE_CORNER}]ESCAPE`]: this.endTextureEdit, // End edit texture

    // Mask edit mode

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
  set isMaskMode(frame) {
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

  setResolution() { console.log("TODO: Set resolution") }
  
  setTextureOrMask = async (filter = {}) => {
    this.#keyboard.active = false
    this.#textureEditor = this.#textureEditor ?? new TextureEditor(this.#textureList)
    this.shadowRoot.appendChild(this.#textureEditor)
    const {texture, mask} = await this.#textureEditor.modal(filter)
    this.shadowRoot.removeChild(this.#textureEditor)
    if (this.activeFrame) {
      if ( texture !== undefined )  { this.activeFrame.texture.id = texture }
      if ( mask !== undefined ) { this.activeFrame.mask.id = mask }
    }
    this.#render()
    this.#keyboard.active = true
  }

  setTexture() { this.setTextureOrMask({ not: MaskTexture }) }
  setMask() { this.setTextureOrMask({ is: MaskTexture }) }

  async editTexture() {
    if (this.#activeFrame === undefined) { return }
    this.#keyboard.active = false
    this.#textureDialog = this.#textureDialog ?? new TextureDialog()
    const cords = await this.#textureDialog.modal()
    if (cords !== undefined) { 
      this.#activeFrame.texture.cords = cords
      this.#render()
    }
    this.#keyboard.active = true
  }

  editMask() { console.log("TODO: editTexture") }

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
