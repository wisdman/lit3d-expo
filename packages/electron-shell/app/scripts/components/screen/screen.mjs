
import { API } from "../../services/api.mjs" 

import { PlayerComponent } from "../player/player.mjs" 

import CSS from "./screen.css" assert { type: "css" }

export class ScreenComponent extends HTMLElement {

  #api = new API()

  #player = new PlayerComponent()
  #fileSelector = document.createElement("input")
  
  #id = 0

  get config() { return { id: this.#id, url: this.#player.url } }

  constructor({ id = 0, url = "", width = 1920, height = 1080, parts = 1 } = {}){
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
    
    this.shadowRoot.appendChild(this.#player)

    this.#fileSelector.type = "file"
    this.#fileSelector.accept = PlayerComponent.allowExtension.map(ext => `.${ext}`).join(", ")
    this.#fileSelector.addEventListener("change", this.#upload, { passive: true })
    this.shadowRoot.appendChild(this.#fileSelector)

    this.#id = id
    this.#player.url = url

    this.style.setProperty("--width" , width )
    this.style.setProperty("--height", height)
    this.style.setProperty("--parts" , parts )
  }

  connectedCallback() {
    this.addEventListener("click", this.#onClick, { passive: true })
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick, { passive: true })
  }

  #onClick = () => {
    this.#fileSelector.value = ""
    this.#fileSelector.click()
  }

  #upload = async () => {
    const url = await this.#api.Upload(this.#fileSelector.files[0])
    if (!url) { return }
    this.#player.url = url
  }
}

customElements.define("ss-screen", ScreenComponent)