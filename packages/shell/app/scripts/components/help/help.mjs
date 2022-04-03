
import { Keyboard } from "../../services/keyboard.mjs"

import CSS from "./help.css" assert { type: "css" }

const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const HELP_DATA = await (await fetch(`${CURRENT_PATH}help.json`)).json()

export class HelpComponent extends HTMLElement {  
  #keyboard = new Keyboard()

  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
    this.#keyboard.on("?", this.#toggle)
    this.#keyboard.active = true
    this.#render()
    this.remove()
  }

  #render = () => {
    for (const {title, commands} of HELP_DATA) {
      const section = document.createElement("section")
      
      const h1 = document.createElement("h1")
      h1.innerText = title
      section.appendChild(h1)

      for (const [key, value] of Object.entries(commands)) {
        const spanKey = document.createElement("span")
        spanKey.innerText = key
        section.appendChild(spanKey)
        const spanValue = document.createElement("span")
        spanValue.innerText = value
        section.appendChild(spanValue)
      }
      
      this.shadowRoot.appendChild(section)
    }
  }

  #toggle = () => {
    if (document.body.contains(this)) this.remove()
    else document.body.appendChild(this)
  }
}

customElements.define("ss-help", HelpComponent)