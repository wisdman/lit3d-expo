
import { API } from "../../services/api.mjs" 
import { MapperComponent } from "../mapper/mapper.mjs"

import CSS from "./full-screen.css" assert { type: "css" }

export class FullScreenComponent extends HTMLElement {
  #api = new API()

  constructor(){
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }

  async connectedCallback() {
    const windowId = this.#api.GetWindowID()
    // await this.#api.SetWindowID(windowId)
    await this.#api.ChromeF11(windowId)
  
    // await this.#api.SetWindowID(null)
    this.shadowRoot.appendChild(new MapperComponent())
  }
}

customElements.define("ss-full-screen", FullScreenComponent)