import { Keyboard } from "../../../services/keyboard.mjs"
import { API_PATH_CONTENT } from "../../../services/api.mjs"
import { Dialog } from "../../dialog/dialog.mjs"

import { DEFAULT_COLOR } from "../constants.mjs"

import CSS from "./editor.css" assert { type: "css" }

const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const DEFAULT_CONTENT_LIST = [
  new URL(`${CURRENT_PATH}pattern.avif`).pathname,
  new URL(`${CURRENT_PATH}pattern.mkv`).pathname
]

export class Editor extends HTMLElement {

  #keyboard = new Keyboard()
  #list = undefined

  constructor(list) {
    super()
    this.#list = list
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
    this.#initKeyboard()
  }

  #activeItem = 0
  #render = () => {
    this.shadowRoot.innerHTML = ""
    
    if (this.#activeItem < 0 || this.#activeItem >= this.#list.length) {
      this.#activeItem = 0
    }
    
    for (var i = 0, l = this.#list.length; i < l; i++) {
      const texture = this.#list.get(i)

      if (texture.source) {
        const node = texture.source
        node.id = texture.id
        if (i === this.#activeItem) node.classList.add("active")
        else node.classList.remove("active")
        this.shadowRoot.appendChild(node)
        continue
      }

      if (texture.mask) {
        const maskNode = document.createElement("div")
        maskNode.id = texture.id
        maskNode.classList.add("mask")
        maskNode.innerHTML = texture.mask.join()
        maskNode.style.backgroundColor = `gray`
        if (i === this.#activeItem) maskNode.classList.add("active")
        else maskNode.classList.remove("active")
        this.shadowRoot.appendChild(maskNode)
        continue
      }

      if (texture.color) {
        const colorNode = document.createElement("div")
        colorNode.id = texture.id
        colorNode.classList.add("color")
        colorNode.innerHTML = texture.color.join()
        colorNode.style.backgroundColor = `rgba(${texture.color.join()})`
        if (i === this.#activeItem) colorNode.classList.add("active")
        else colorNode.classList.remove("active")
        this.shadowRoot.appendChild(colorNode)
        continue
      }      
    }
  }

  #initKeyboard = () => {
    this.#keyboard.on("C", this.#onCKey) // New color texture
    this.#keyboard.on("D", this.#onDKey) // Delete texture
    this.#keyboard.on("M", this.#onMKey) // New mask node
    this.#keyboard.on("SHIFT+M", this.#onShiftMKey) // New mask node
    this.#keyboard.on("P", this.#onPKey) // Play (Shift pause)
    this.#keyboard.on("SHIFT+P", this.#onShiftPKey) // Play (Shift pause)
    this.#keyboard.on("U", this.#onUKey) // New texture from url
    this.#keyboard.on("ARROWLEFT" , this.#onPrewKey) // Prew texture
    this.#keyboard.on("ARROWRIGHT", this.#onNextKey) // Next texture
    this.#keyboard.on("ESCAPE", this.#onEscKey)       // Escape Key
    this.#keyboard.on("ENTER", this.#onEnterKey)      // Enter Key
  }

  #onCKey = async () => { // New color texture
    this.#keyboard.active = false
    const color = await new Dialog("color", { color: DEFAULT_COLOR }).modal()
    this.#keyboard.active = true
    if (!color) { return }
    await this.#list.add({ color })
  }

  #onDKey = () => { // Delete texture
    if (this.#activeItem < 0 || this.#activeItem >= this.#list.length) return
    this.#list.remove(this.#list.get(this.#activeItem))
  }

  #onMKey = async () => await this.#list.add({ mask: [255] })
  #onShiftMKey = async ({shift}) => await this.#list.add({ mask: [0, 255] })

  #onPKey = () => this.#list.play()
  #onShiftPKey = () => this.#list.pause()

  #onUKey = async () => { // New texture from url
    this.#keyboard.active = false
    const datalist = [...DEFAULT_CONTENT_LIST, ...(await (await fetch(API_PATH_CONTENT)).json())]
    const url = await new Dialog("content", { datalist }).modal()
    this.#keyboard.active = true
    if (!url) { return }
    await this.#list.add({ url })
  }

  #onPrewKey = () => { // Prew texture
    this.#activeItem--
    if ( this.#activeItem < 0 ) { this.#activeItem = 0 }
    this.#render()
  }

  #onNextKey = () => { // Next texture
    this.#activeItem++
    if ( this.#activeItem >= this.#list.length ) { this.#activeItem = this.#list.length - 1 }
    this.#render()
  }

  #onEscKey = () => this.dispatchEvent(new CustomEvent("close", { detail: {} }))

  #onEnterKey = () => {
    const texture = this.#list.get(this.#activeItem)
    this.dispatchEvent(new CustomEvent("close", { detail: { [texture.mask ? "mask" : "texture"]: texture.id } }))
  }

  connectedCallback() {
    this.#list.addEventListener("change", this.#render)
    this.#render()
    this.#keyboard.active = true
  }

  disconnectedCallback() {
    this.#keyboard.active = false
    this.shadowRoot.innerHTML = ""
  }

  wait = () => new Promise(resolve => this.addEventListener("close", ({detail}) => {
    resolve(detail)
  }, { once: true }))
}

customElements.define("ss-mapper-textures", Editor)