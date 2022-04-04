
import { Keyboard } from "../../../services/keyboard.mjs"
import { DEFAULT_RESOLUTION } from "/common/entities/constants.mjs"

import { Editor as TextureEditor } from "../texture/editor.mjs"

import CSS from "./editor.css" assert { type: "css" }

const SVG_NAMESPACE = "http://www.w3.org/2000/svg"

export class Editor extends HTMLElement {
  static CORNER_RADIUS = 10

  static Path(frame, isActive) {
    const [x1, y1, x2, y2, x3, y3, x4, y4] = frame.corners
    const d = `M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} L${x4} ${y4} Z`
    const path = document.createElementNS(SVG_NAMESPACE, "path")
    path.setAttributeNS(null, "d", d)
    if (isActive) path.classList.add("active")
    return path
  }

  static Corner(frame, i, isActive) {
    const [cx, cy] = frame.corners[i]
    const circle = document.createElementNS(SVG_NAMESPACE, "circle")
    circle.setAttributeNS(null, "cx", cx)
    circle.setAttributeNS(null, "cy", cy)
    circle.setAttributeNS(null, "r", this.CORNER_RADIUS)
    if (isActive) circle.classList.add("active")
    return circle
  }

  #keyboard = new Keyboard()
  #frames = undefined
  #textures = undefined

  #svg = this.attachShadow({mode: "open"})
             .appendChild(document.createElementNS(SVG_NAMESPACE, "svg"))

  constructor(frames, textures, [width, height] = DEFAULT_RESOLUTION) {
    super()
    this.#frames = frames
    this.#textures = textures
    this.shadowRoot.adoptedStyleSheets = [CSS]
    this.#svg.setAttributeNS(null, "width", "100%")
    this.#svg.setAttributeNS(null, "height", "100%")
    this.#svg.setAttributeNS(null, "viewBox", `0 0 ${width}, ${height}`)
    this.#initKeyboard()
  }

  get frames() { return [...this.#frames] }

  #activeFrame = undefined
  get activeFrame() { return this.#activeFrame }
  set activeFrame(frame) { 
    this.#activeFrame = this.#frames.has(frame) ? frame : undefined
    this.#activeCorner = -1
    this.#render()
  }

  #activeCorner = -1
  get activeCorner() { return this.#activeCorner }
  set activeCorner(i) {
    if (this.#activeFrame === undefined) return
    this.#activeCorner = i
    this.#render()
  }

  #render = () => {
    this.#svg.innerHTML = ""
    for (const frame of this.frames) {
      const isActive = frame === this.#activeFrame
      this.#svg.appendChild(Editor.Path(frame, isActive))
      this.#svg.appendChild(Editor.Corner(frame, 0, isActive && this.#activeCorner === 0))
      this.#svg.appendChild(Editor.Corner(frame, 1, isActive && this.#activeCorner === 1))
      this.#svg.appendChild(Editor.Corner(frame, 2, isActive && this.#activeCorner === 2))
      this.#svg.appendChild(Editor.Corner(frame, 3, isActive && this.#activeCorner === 3))
    }
    this.dispatchEvent(new Event("render"))
  }

  #initKeyboard = () => {
    this.#keyboard.on("CTRL+1", this.#onCtrl1Key) // Key 1
    this.#keyboard.on("CTRL+2", this.#onCtrl2Key) // Key 2
    this.#keyboard.on("CTRL+3", this.#onCtrl3Key) // Key 3
    this.#keyboard.on("CTRL+4", this.#onCtrl4Key) // Key 4
    this.#keyboard.on("CTRL+5", this.#onCtrl5Key) // Key 5
    this.#keyboard.on("CTRL+6", this.#onCtrl6Key) // Key 6
    this.#keyboard.on("CTRL+7", this.#onCtrl7Key) // Key 7
    this.#keyboard.on("CTRL+8", this.#onCtrl8Key) // Key 8
    this.#keyboard.on("CTRL+9", this.#onCtrl9Key) // Key 9
    
    this.#keyboard.on("1", this.#on1Key) // Key 1
    this.#keyboard.on("2", this.#on2Key) // Key 2
    this.#keyboard.on("3", this.#on3Key) // Key 3
    this.#keyboard.on("4", this.#on4Key) // Key 4
    
    this.#keyboard.on("A", this.#onAKey) // Add frame
    this.#keyboard.on("D", this.#onDKey) // Delete frame
    this.#keyboard.on("P", this.#onPKey) // Play (Shift pause)
    this.#keyboard.on("SHIFT+P", this.#onShiftPKey) // Play (Shift pause)
    this.#keyboard.on("R", this.#onRKey) // Set resolution
    this.#keyboard.on("T", this.#onTKey) // Set texture
    
    this.#keyboard.on("ARROWLEFT" , this.#onLeftKey)  // Left Key
    this.#keyboard.on("SHIFT+ARROWLEFT" , this.#onLeftKey)  // Left Key
    this.#keyboard.on("ARROWRIGHT", this.#onRightKey) // Right Key
    this.#keyboard.on("SHIFT+ARROWRIGHT", this.#onRightKey) // Right Key
    this.#keyboard.on("ARROWUP", this.#onUpKey)       // Up Key
    this.#keyboard.on("SHIFT+ARROWUP", this.#onUpKey)       // Up Key
    this.#keyboard.on("ARROWDOWN", this.#onDownKey)   // Down Key
    this.#keyboard.on("SHIFT+ARROWDOWN", this.#onDownKey)   // Down Key
    this.#keyboard.on("ESCAPE", this.#onEscKey)       // Escape Key
  }

  #onCtrl1Key = () => this.activeFrame = this.frames[0]
  #onCtrl2Key = () => this.activeFrame = this.frames[1]
  #onCtrl3Key = () => this.activeFrame = this.frames[2]
  #onCtrl4Key = () => this.activeFrame = this.frames[3]
  #onCtrl5Key = () => this.activeFrame = this.frames[4]
  #onCtrl6Key = () => this.activeFrame = this.frames[5]
  #onCtrl7Key = () => this.activeFrame = this.frames[6]
  #onCtrl8Key = () => this.activeFrame = this.frames[7]
  #onCtrl9Key = () => this.activeFrame = this.frames[8]

  #on1Key = () => this.activeCorner = 0
  #on2Key = () => this.activeCorner = 1
  #on3Key = () => this.activeCorner = 2
  #on4Key = () => this.activeCorner = 3
  
  #onAKey = () => {
    this.#frames.new()
    this.#render()
  }
  #onDKey = () => {
    this.#frames.remove(this.activeFrame)
    this.#render()
  }
  
  #onPKey = () => this.#textures.play()
  #onShiftPKey = () => this.#textures.pause()
  
  #onRKey = () => {}

  #onTKey = async () => {
    this.#keyboard.active = false
    const textureEditor = new TextureEditor(this.#textures)
    const {texture, mask} = await this.shadowRoot.appendChild(textureEditor).wait()
    this.shadowRoot.removeChild(textureEditor)
    if (this.activeFrame) {
      this.activeFrame.texture.id = texture
      this.activeFrame.mask.id = mask
    }
    this.#render()
    this.#keyboard.active = true
  }

  #onLeftKey = ({shift}) => { 
    this.activeCorner >= 0
    ? this.activeFrame?.corners?.move(this.activeCorner, shift ? -10 : -1, 0)
    : this.activeFrame?.corners?.move(shift ? -10 : -1, 0);
    this.#render()
  }
  
  #onRightKey = ({shift}) => {
    this.activeCorner >= 0
    ? this.activeFrame?.corners?.move(this.activeCorner, shift ? 10 : 1, 0)
    : this.activeFrame?.corners?.move(shift ? 10 : 1, 0);
    this.#render()
  }
  
  #onUpKey = ({shift}) => {
    this.activeCorner >= 0
    ? this.activeFrame?.corners?.move(this.activeCorner, 0, shift ? -10 : -1)
    : this.activeFrame?.corners?.move(0, shift ? -10 : -1);
    this.#render()
  }
  
  #onDownKey = ({shift}) => {
    this.activeCorner >= 0
    ? this.activeFrame?.corners?.move(this.activeCorner, 0, shift ? 10 : 1)
    : this.activeFrame?.corners?.move(0, shift ? 10 : 1);
    this.#render()
  }
  
  #onEscKey = () => {
    if (this.activeCorner >= 0) {
      this.activeCorner = -1
      return
    }

    if (this.activeFrame) {
      this.activeFrame = undefined
      return
    }

    this.dispatchEvent(new Event("close"))
  }

  connectedCallback() {
    this.#render()
    this.#keyboard.active = true
  }

  disconnectedCallback() {
    this.#keyboard.active = false
    this.shadowRoot.innerHTML = ""
  }

  wait = () => new Promise(resolve => this.addEventListener("close", resolve, { once: true }))
}

customElements.define("ss-mapper-frames", Editor)
