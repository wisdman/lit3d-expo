
import { UInt8Vector3 } from "/common/types/vector.mjs"

import { Dialog } from "../../dialog/dialog.mjs"

import CSS from "./dialog-color.css" assert { type: "css" }
const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const TEMPLATE = await (await fetch(`${CURRENT_PATH}dialog-color.tpl`)).text()

const CANCEL = "Cancel"
const CONFIRM = "Confirm"

const COLOR_RX = /^#?(?<r>[0-9a-f]{2})(?<g>[0-9a-f]{2})(?<b>[0-9a-f]{2})/i

export class ColorDialog extends Dialog {
  static TYTLE = "Select color"
  static STYLE = [CSS]
  static TEMPLATE = TEMPLATE
  static BUTTONS = [CANCEL, CONFIRM]

  async init(root, color = new UInt8Vector3()) {
    const colorNode = root.querySelector("#picker")
    const labelNode = root.querySelector("#label")
    colorNode.addEventListener("input", () => labelNode.innerText = colorNode.value, { passive: true })
    labelNode.innerText = colorNode.value = `#${color.map(v => v.toString(16)).join("")}`
  }

  async onSubmit(returnValue, data) {
    const color = data?.color
    if (returnValue !== CONFIRM || !color) { return undefined }
    const {r = "00", g = "00", b = "00"} = COLOR_RX.exec(color)?.groups ?? {}
    return new UInt8Vector3([Number.parseInt(r,16), Number.parseInt(g,16), Number.parseInt(b,16)])
  }
}

customElements.define("ss-dialog-color", ColorDialog)
