
import { Dialog } from "../../dialog/dialog.mjs"

import CSS from "./dialog-size.css" assert { type: "css" }
const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const TEMPLATE = await (await fetch(`${CURRENT_PATH}dialog-size.tpl`)).text()

const CANCEL = "Cancel"
const CONFIRM = "Confirm"

const COLOR_RX = /^#?(?<r>[0-9a-f]{2})(?<g>[0-9a-f]{2})(?<b>[0-9a-f]{2})/i

export class SizeDialog extends Dialog {
  static TYTLE = "Select color"
  static STYLE = [CSS]
  static TEMPLATE = TEMPLATE
  static BUTTONS = [CANCEL, CONFIRM]

  async init(root) {
    root.querySelector("select").addEventListener("keydown", ({key}) => key.toUpperCase() === "ENTER" && this.submit(CONFIRM))
  }

  async onSubmit(returnValue, data) {
    const size = data?.size
    if (returnValue !== CONFIRM || !size) { return undefined }
    return size.split(/[^\d]+/).map(v => Number.parseInt(v))
  }
}

customElements.define("ss-dialog-size", SizeDialog)
