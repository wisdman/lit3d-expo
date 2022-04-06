
// import { Content } from "/common/entities/content.mjs"

// import { ID, API_PATH_CONFIG } from "../../services/api.mjs"

import CSS from "./config-editor.css" assert { type: "css" }

export class ConfigEditor extends HTMLElement {
  
  // #config = new Content()

  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }

  // #fetchConfig = async () => await (await fetch(API_PATH_CONFIG)).json()

  // async connectedCallback() {
    // const config = await this.#fetchConfig()
    // this.#config = new Content(config)

    // console.log(this.#config)
  // }

}

customElements.define("ss-config-editor", ConfigEditor)