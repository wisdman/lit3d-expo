
import { UInt8Vector3 } from "/common/types/vector.mjs"

import { Dialog } from "../../dialog/dialog.mjs"

import CSS from "./dialog-texture.css" assert { type: "css" }
const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const TEMPLATE = await (await fetch(`${CURRENT_PATH}dialog-texture.tpl`)).text()

const CANCEL = "Cancel"
const CONFIRM = "Confirm"

export class TextureDialog extends Dialog {
  static TYTLE = "Select texture part color"
  static STYLE = [CSS]
  static TEMPLATE = TEMPLATE
  static BUTTONS = [CANCEL, CONFIRM]

  async init(root) {
    const selectNode = root.querySelector("select")
    selectNode.addEventListener("keydown", ({key}) => key.toUpperCase() === "ENTER" && this.submit(CONFIRM))
    
    const parts = 6
    for (let i = 2; i <= parts; i++) {
      for (let j = 0; j < i; j++) {
        const dx = Math.round(1/i * 1000)/1000
        const cords = `${j*dx},0,${j*dx+dx},0,${j*dx+dx},1,${j*dx},1`
        const option = document.createElement("option")
        option.value = cords
        option.innerHTML = `${j+1}/${i} => ${cords}`
        selectNode.appendChild(option)
      }
    }
  }

  async onSubmit(returnValue, data) {
    const cords = data?.cords
    if (returnValue !== CONFIRM || !cords) { return undefined }
    return cords.split(",").map(v => Number.parseFloat(v))
  }
}

customElements.define("ss-dialog-texture", TextureDialog)
