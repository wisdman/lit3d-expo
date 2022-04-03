import { Keyboard } from "../../services/keyboard.mjs"
import { ID, MAPPING_ID, API_PATH_CONFIG } from "../../services/api.mjs"

import { Mapper } from "../mapper/mapper.mjs"
import { FullScreen } from "../full-screen/full-screen.mjs"

import CSS from "./app.css" assert { type: "css" }

export class AppComponent extends HTMLElement {
  #keyboard = new Keyboard()
  #mapper = undefined
  
  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
    this.#initKeyboard()
  }

  #fetchConfig = async () => await (await fetch(API_PATH_CONFIG)).json()
  #mappingConfig = async () => (await this.#fetchConfig()).mapping?.[MAPPING_ID]

  async connectedCallback() {
    const mappingConfig = await this.#mappingConfig()
    this.#mapper = mappingConfig
                 ? document.body.appendChild( mappingConfig.url 
                                            ? new FullScreen(mappingConfig) 
                                            : new Mapper(mappingConfig)
                                            )
                 : undefined
    this.#keyboard.active = true

    // console.dir(await window.getScreenDetails())
  }

  disconnectedCallback() {
    this.#keyboard.active = false
    if (this.#mapper) document.body.removeChild(this.#mapper)
  }

  #initKeyboard = () => {
    this.#keyboard.on("CTRL+A", this.#onMetaAKey) // Audio config
    this.#keyboard.on("META+A", this.#onMetaAKey) // Audio config
    this.#keyboard.on("CTRL+E", this.#onMetaEKey) // Exec config
    this.#keyboard.on("META+E", this.#onMetaEKey) // Exec config
    this.#keyboard.on("CTRL+M", this.#onMetaMKey) // Edit screens
    this.#keyboard.on("META+M", this.#onMetaMKey) // Edit screens
    this.#keyboard.on("CTRL+S", this.#onMetaSKey) // Save config
    this.#keyboard.on("META+S", this.#onMetaSKey) // Save config
  }

  #onMetaAKey = async () => {
    console.log("CTRL+A")
  }

  #onMetaEKey = async () => {
    console.log("CTRL+E")
  }

  #onMetaMKey = async () => {
    console.log("CTRL+M")
  }

  #onMetaSKey = async () => {
    console.log(JSON.stringify(this.#mapper))
  }
}

customElements.define("ss-app", AppComponent)