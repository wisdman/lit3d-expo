
import { API } from "../../services/api.mjs" 
import { Keyboard } from "../../services/keyboard.mjs"

import { SoundComponent } from "../sound/sound.mjs"

import CSS from "./app.css" assert { type: "css" }

export class AppComponent extends HTMLElement {
  static MappingWindow = (id, left, top) => {
    const features = [
      `left=${left}`,
      `top=${top}`,
      `width=1000`,
      `height=1000`,
      // `menubar=no`,
      // `toolbar=no`,
      // `location=no`,
      // `status=no`,
      // `resizable=yes`,
       // `scrollbars=no`
    ].join(",")
    return window.open(`/full-screen#${id}`, `mapping-${id}`, features)
  }

  #SHORTCUTS = {
    "SHIFT+M": this.generateMapping, // Mapping windows generator
  }
  #keyboard = new Keyboard(this, this.#SHORTCUTS)

  #api = new API()
  #screens = []

  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
    this.shadowRoot.appendChild(new SoundComponent())
  }

  generateMapping() {
    for (const {left, top} of this.#screens) {
      const win = AppComponent.MappingWindow(`${left}-${top}`, left, top)
    }
  }

  async connectedCallback() {
    this.#keyboard.active = true
    this.#screens = (await window.getScreenDetails()).screens
    const mapping = await this.#api.GetConfigContentMapping()
    for (const {id, location:[left, top]} of mapping) {
      const win = AppComponent.MappingWindow(id, left, top)
    }
  }
}

customElements.define("ss-app", AppComponent)