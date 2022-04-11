
import { Keyboard } from "../../../services/keyboard.mjs"

import { UrlDialog } from "./dialog-url.mjs"
import { ColorDialog } from "./dialog-color.mjs"
import { VideoTexture, ImageTexture, ColorTexture, MaskTexture  } from "./texture.mjs"

import CSS from "./texture-editor.css" assert { type: "css" }

export class TextureEditor extends HTMLElement {
  #SHORTCUTS = {
    "C": this.createColor, // New color texture
    "M": this.createMask,  // New mask node
    "U": this.createURL,   // New texture from url

    "SHIFT+C": this.replaceColor, // Replace current texture with new color texture
    "SHIFT+M": this.replaceMask,  // Replace current texture with new mask node
    "SHIFT+U": this.replaceURL,   // Replace current texture with new texture from url

    "D": this.delete, // Delete texture

    "P": this.play,        // Play content
    "SHIFT+P": this.pause, // Pause content
    
    "ARROWLEFT":  this.prew, // Prew texture
    "ARROWRIGHT": this.next, // Next texture
    
    "ESCAPE": this.close,  // Close Editor
    "ENTER":  this.select, // Close Editor and return id
  } 
  #keyboard = new Keyboard(this, this.#SHORTCUTS)

  #urlDialog = undefined
  #colorDialog = undefined

  #textureList = undefined
  get textures() { return [...this.#textureList] }

  #activeTexture = undefined
  get activeTexture() { return this.#activeTexture }
  set activeTexture(texture) { 
    this.#activeTexture = this.#textureList.has(texture) ? texture : undefined
    this.#render()
  }
  
  constructor(textureList) {
    super()
    this.#textureList = textureList
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }

  #render = () => {
    this.shadowRoot.innerHTML = ""

    for (const texture of this.textures) {
      let node
      if (texture instanceof VideoTexture || texture instanceof ImageTexture) {
        node = texture.source
      } else if (texture instanceof ColorTexture) {
        node = document.createElement("div")
        node.classList.add("color")
        node.innerHTML = [...texture.color].join()
        node.style.backgroundColor = `rgba(${[...texture.color].join()})`
      } else if (texture instanceof MaskTexture) {
        node = document.createElement("div")
        node.classList.add("mask")
        node.innerHTML = texture.mask.color?.join() ?? texture.mask.url ?? ""
        node.style.backgroundColor = `gray`
      } else { continue }

      node.id = texture.id
      if (texture === this.activeTexture) node.classList.add("active")
      else node.classList.remove("active")
      this.shadowRoot.appendChild(node)
    }
  }

  prew() { // Prew texture
    const textures = this.textures

    if (this.activeTexture === undefined) {
      this.activeTexture = this.textures[textures.length-1]
      return
    }

    for (const [i, texture] of textures.entries()) {
      if (texture === this.activeTexture) {
        this.activeTexture = textures[i-1 < 0 ? textures.length-1 : i-1]
        return
      }
    }
  }

  next() { // Next texture
    const textures = this.textures

    if (this.activeTexture === undefined) {
      this.activeTexture = textures[0]
      return
    }

    for (const [i, texture] of textures.entries()) {
      if (texture === this.activeTexture) {
        this.activeTexture = textures[i+1 >= textures.length ? 0 : i+1]
        return
      }
    }
  }

  async createColor() {
    this.#keyboard.active = false
    this.#colorDialog = this.#colorDialog ?? new ColorDialog()
    const color = await this.#colorDialog.modal()
    if (color !== undefined) { 
      this.#activeTexture = this.#textureList.new({ color })
      this.#render()
    }
    this.#keyboard.active = true
  }

  async createMask() {
    this.#activeTexture = this.#textureList.new({ mask: { color: [0, 255, 0] } })
    this.#render()
  }

  async createURL() {
    this.#keyboard.active = false
    this.#urlDialog = this.#urlDialog ?? new UrlDialog()
    const url = await this.#urlDialog.modal()
    if (url !== undefined) { 
      this.#activeTexture = this.#textureList.new({ url })
      this.#render()
    }
    this.#keyboard.active = true
  }

  async replaceColor() {
    if (this.#activeTexture === undefined) { return }
    this.#keyboard.active = false
    this.#colorDialog = this.#colorDialog ?? new ColorDialog()
    const oldColor = this.#activeTexture.color
    const color = await this.#colorDialog.modal(oldColor)
    if (color !== undefined) { 
      const id = this.activeTexture.id
      this.#textureList.delete(this.activeTexture)
      this.#activeTexture = this.#textureList.new({ color })
      this.#render()
    }
    this.#keyboard.active = true
  }

  async replaceMask() {
    console.log("TODO: Add mask")
  }

  async replaceURL() {
    if (this.#activeTexture === undefined) { return }
    this.#urlDialog = this.#urlDialog ?? new UrlDialog()
    const url = await this.#urlDialog.modal()
    if (url !== undefined) { 
      const id = this.activeTexture.id
      this.#textureList.delete(this.activeTexture)
      this.#activeTexture = this.#textureList.new({ id, url })
      this.#render()
    }
    this.#keyboard.active = true
  }

  delete() {
    // console.log("DEL")
    this.#textureList.delete(this.activeTexture)
    this.#activeTexture = undefined
    this.#render()
  }

  close() {
    this.dispatchEvent(new CustomEvent("close", { detail: {} }))
  }

  select() {
    if (this.#activeTexture === undefined) { return }
    const detail = { [this.#activeTexture instanceof MaskTexture ? "mask" : "texture"]: this.#activeTexture.id }
    this.dispatchEvent(new CustomEvent("close", { detail }))
  }

  play() { this.#textureList.play() }
  pause() { this.#textureList.pause() }

  connectedCallback() {
    this.#activeTexture = undefined
    this.#render()
    this.#keyboard.active = true
  }

  disconnectedCallback() {
    this.#keyboard.active = false
    this.shadowRoot.innerHTML = ""
  }

  modal = (filter) => {
    console.log("TODO: filter")
    // this.#filter = filter
    // this.#render()
    return new Promise(resolve => this.addEventListener("close", ({detail}) => resolve(detail), { once: true }))
  }
}

customElements.define("ss-mapper-textures", TextureEditor)