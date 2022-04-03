
import { API_PATH_CONFIG } from "../../services/api.mjs"

import CSS from "./config.css" assert { type: "css" }

export class Config extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
    return this.#init()
  }

  #init = async () => {
    
  }

  #fetchConfig = async () => await (await fetch(API_PATH_CONFIG)).json()
}

customElements.define("ss-config", Config)