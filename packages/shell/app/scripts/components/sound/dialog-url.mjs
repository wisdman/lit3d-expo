
import { API } from "../../services/api.mjs"

import { Dialog } from "../dialog/dialog.mjs"

const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")

import CSS from "./dialog-url.css" assert { type: "css" }
const TEMPLATE = await (await fetch(`${CURRENT_PATH}dialog-url.tpl`)).text()

const CANCEL = "Cancel"
const CONFIRM = "Confirm"

export class UrlDialog extends Dialog {
  static TYTLE = "Select url from content"
  static STYLE = [CSS]
  static TEMPLATE = TEMPLATE
  static BUTTONS = [CANCEL, CONFIRM]

  #api = new API()

  async init(root) {
    const contentList = await this.#api.GetContentSound()
    const selectNode = root.querySelector("select")
    for (const value of contentList) {
      const option = document.createElement("option")
      option.value = value
      option.innerHTML = value
      selectNode.appendChild(option)
    }

    const audioNode = root.querySelector("audio")
    audioNode.controls = true

    selectNode.addEventListener("keydown", ({key}) => key.toUpperCase() === "ENTER" && this.submit(CONFIRM))

    selectNode.addEventListener("change", () => {
      const url = selectNode.value
      audioNode.src = url
      audioNode.play()
    })
    
    selectNode.dispatchEvent(new Event("change"))
  }

  async onSubmit(returnValue, data) {
    return returnValue === CONFIRM && data?.url || undefined 
  }
}

customElements.define("ss-dialog-url-sound", UrlDialog)
