
import { API } from "../../services/api.mjs" 

import CSS from "./full-screen.css" assert { type: "css" }

const VK_F11 = 0x7A

export class FullScreenComponent extends HTMLElement {
  #api = new API()

  constructor(){
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }

  async connectedCallback() {
    window.addEventListener("keydown", event => console.log("keydown", event))
    window.addEventListener("keyup", event => console.log("keyup", event))

    const windowId = Math.random().toString(16).slice(2)
    await this.#api.SetWindowID(windowId)
    await this.#api.ChromeKeyPress(windowId, VK_F11)
    // this.shadowRoot.appendChild(new Mapper())
  }
}

customElements.define("ss-full-screen", FullScreenComponent)