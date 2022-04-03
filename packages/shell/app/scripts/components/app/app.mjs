
import { Content } from "/common/entities/content.mjs"

import { ID, API_PATH_CONFIG } from "../../services/api.mjs"

import { ConfigEditor } from "../config-editor/config-editor.mjs"

import CSS from "./app.css" assert { type: "css" }

export class AppComponent extends HTMLElement {
  static MappingWindow = (left, top, w, h) => {
    const features = [
      `left=${left}`,
      `top=${top}`,
      `width=${w}`,
      `height=${h}`,
      `menubar=no`,
      `toolbar=no`,
      `location=no`,
      `status=no`,
      `resizable=yes`,
      `scrollbars=no`
    ].join(",")
    return window.open("mapping.html", Math.random().toString(), features)
  }

  #config = new Content()
  #editor = new ConfigEditor()

  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }

  #fetchConfig = async () => await (await fetch(API_PATH_CONFIG)).json()

  #runMappers = async () => {
    const screens = (await window.getScreenDetails()).screens
    console.dir(screens)
    for (const { left, top } of screens) {
      console.log(left, top)
      const m1 = AppComponent.MappingWindow(left, top, 100, 100)
      console.log(m1)
    }
  }

  async connectedCallback() {
    const config = await this.#fetchConfig()
    this.#config = new Content(config)
    this.shadowRoot.appendChild(this.#editor)
    await this.#runMappers()
  }
}

customElements.define("ss-app", AppComponent)