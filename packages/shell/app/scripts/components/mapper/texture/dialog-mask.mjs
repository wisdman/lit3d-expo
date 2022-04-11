
import { Dialog } from "../../dialog/dialog.mjs"

import CSS from "./dialog-mask.css" assert { type: "css" }
const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const TEMPLATE = await (await fetch(`${CURRENT_PATH}dialog-mask.tpl`)).text()

const CANCEL = "Cancel"
const CONFIRM = "Confirm"

export class MaskDialog extends Dialog {
  static TYTLE = "Select mask"
  static STYLE = [CSS]
  static TEMPLATE = TEMPLATE
  static BUTTONS = [CANCEL, CONFIRM]

  async init(root) {
    const selectNode = root.querySelector("select")
    selectNode.addEventListener("keydown", ({key}) => key.toUpperCase() === "ENTER" && this.submit(CONFIRM))
  }

  async onSubmit(returnValue, data) {
    const colors = data?.colors
    if (returnValue !== CONFIRM || !colors) { return undefined }
    return colors.split(",").map(v => Number.parseInt(v))
  }
}

customElements.define("ss-dialog-mask", MaskDialog)
