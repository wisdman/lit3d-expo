
import { API } from "../../services/api.mjs" 
import { ScreenComponent } from "../screen/screen.mjs"

import CSS from "./config.css" assert { type: "css" }

export class ConfigComponent extends HTMLElement {

  #api = new API()
  #screens = []

  #saveButton = document.createElement("button")

  constructor(){
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
    this.#saveButton.innerText = "Save"
    this.#saveButton.addEventListener("click", this.#save, { passive: true })
  }

  async connectedCallback() {
    this.shadowRoot.innerHTML = ""
    const config = await this.#api.GetConfig()
    this.#screens = config?.screens?.map(cfg => this.shadowRoot.appendChild(new ScreenComponent(cfg)))
    this.shadowRoot.appendChild(this.#saveButton)
  }

  #save = async () => {
    const config = await this.#api.GetConfig()
    this.#screens.forEach(s => {
      const { id: screenId, ...newConfig } = s.config
      const index = config.screens?.findIndex(({ id }) => id === screenId)
      if (index === undefined || index < 0) { throw new Error(`Screen.id "${screenId}" isn't found`) }
      config.screens[index] = { ...(config.screens[index]), ...newConfig }
    })
    await this.#api.SetConfig(config)
  }
}

customElements.define("ss-config", ConfigComponent)
