
import { Keyboard } from "../../../services/keyboard.mjs"

import { Editor as TextureEditor } from "../texture/editor.mjs"

import { DEFAULT_RESOLUTION } from "../constants.mjs"

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
    const [cx, cy] = frame.getCorner(i)
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

  #activeFrame = -1
  get #isFrameActive() { return this.#activeFrame >= 0 && this.#activeFrame < this.#frames.length }
  #activateFrame = (i) => {
    this.#activeFrame = i - 1
    this.#activeCorner = -1
    this.#render()
  }
  
  #activeCorner = -1
  get #isCornerActive() { return this.#isFrameActive && this.#activeCorner >= 0 }
  #activateCorner = (i) => {
    if (this.#activeFrame < 0) return
    this.#activeCorner = i - 1
    this.#render()
  }

  #render = () => {
    this.#svg.innerHTML = ""

    if (this.#activeFrame >= this.#frames.length) {
      this.#activeFrame = -1
      this.#activeCorner = -1
    }

    for (var i = 0, l = this.#frames.length; i < l; i++) {
      const frame = this.#frames.get(i)
      this.#svg.appendChild(Editor.Path(frame, i === this.#activeFrame))
      this.#svg.appendChild(Editor.Corner(frame, 0, i === this.#activeFrame && this.#activeCorner === 0))
      this.#svg.appendChild(Editor.Corner(frame, 1, i === this.#activeFrame && this.#activeCorner === 1))
      this.#svg.appendChild(Editor.Corner(frame, 2, i === this.#activeFrame && this.#activeCorner === 2))
      this.#svg.appendChild(Editor.Corner(frame, 3, i === this.#activeFrame && this.#activeCorner === 3))
    }
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

  #onCtrl1Key = () => this.#activateFrame(1)
  #onCtrl2Key = () => this.#activateFrame(2)
  #onCtrl3Key = () => this.#activateFrame(3)
  #onCtrl4Key = () => this.#activateFrame(4)
  #onCtrl5Key = () => this.#activateFrame(5)
  #onCtrl6Key = () => this.#activateFrame(6)
  #onCtrl7Key = () => this.#activateFrame(7)
  #onCtrl8Key = () => this.#activateFrame(8)
  #onCtrl9Key = () => this.#activateFrame(9)

  #on1Key = () => this.#activateCorner(1)
  #on2Key = () => this.#activateCorner(2)
  #on3Key = () => this.#activateCorner(3)
  #on4Key = () => this.#activateCorner(4)
  
  #onAKey = () => this.#frames.add()
  #onDKey = () => this.#isFrameActive && this.#frames.remove(this.#frames.get(this.#activeFrame))
  
  #onPKey = () => this.#textures.play()
  #onShiftPKey = () => this.#textures.pause()
  
  #onRKey = () => {}

  #onTKey = async () => {
    this.#keyboard.active = false
    const textureEditor = new TextureEditor(this.#textures)
    const {texture, mask} = await this.shadowRoot.appendChild(textureEditor).wait()
    this.shadowRoot.removeChild(textureEditor)
    if (this.#isFrameActive) {
      const frame = this.#frames.get(this.#activeFrame)
      if (Number.isFinite(texture)) frame.textureId = texture
      if (Number.isFinite(mask)) frame.maskId = mask
    }
    this.#keyboard.active = true
  }
  
  #onLeftKey = ({shift}) => this.#isCornerActive 
                          ? this.#frames.get(this.#activeFrame).moveCorner(this.#activeCorner, shift ? -10 : -1, 0)
                          : this.#isFrameActive
                          ? this.#frames.get(this.#activeFrame).move(shift ? -10 : -1, 0)
                          : undefined
  
  #onRightKey = ({shift}) => this.#isCornerActive 
                          ? this.#frames.get(this.#activeFrame).moveCorner(this.#activeCorner, shift ? 10 : 1, 0)
                          : this.#isFrameActive
                          ? this.#frames.get(this.#activeFrame).move(shift ? 10 : 1, 0)
                          : undefined
  
  #onUpKey = ({shift}) => this.#isCornerActive 
                          ? this.#frames.get(this.#activeFrame).moveCorner(this.#activeCorner, 0, shift ? -10 : -1)
                          : this.#isFrameActive
                          ? this.#frames.get(this.#activeFrame).move(0, shift ? -10 : -1)
                          : undefined
  
  #onDownKey = ({shift}) => this.#isCornerActive 
                          ? this.#frames.get(this.#activeFrame).moveCorner(this.#activeCorner, 0, shift ? 10 : 1)
                          : this.#isFrameActive
                          ? this.#frames.get(this.#activeFrame).move(0, shift ? 10 : 1)
                          : undefined
  
  #onEscKey = () => {
    if (this.#isCornerActive) {
      this.#activeCorner = -1
      this.#render()
      return
    }

    if (this.#isFrameActive) {
      this.#activeFrame = -1
      this.#render()
      return
    }

    this.dispatchEvent(new Event("close"))
  }

  connectedCallback() {
    this.#frames.addEventListener("change", this.#render, { passive: true })
    this.#render()
    this.#keyboard.active = true
  }

  disconnectedCallback() {
    this.#frames.removeEventListener("change", this.#render)
    this.shadowRoot.innerHTML = ""
    this.#keyboard.active = false
  }

  wait = () => new Promise(resolve => this.addEventListener("close", resolve, { once: true }))
}

customElements.define("ss-mapper-frames", Editor)
