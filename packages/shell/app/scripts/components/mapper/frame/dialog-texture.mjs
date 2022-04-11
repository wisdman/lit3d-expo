
import { Dialog } from "../../dialog/dialog.mjs"

import { VideoTexture, ImageTexture } from "../texture/texture.mjs"

import CSS from "./dialog-texture.css" assert { type: "css" }
const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")
const TEMPLATE = await (await fetch(`${CURRENT_PATH}dialog-texture.tpl`)).text()

const CANCEL = "Cancel"
const CONFIRM = "Confirm"

export class TextureDialog extends Dialog {
  static TYTLE = "Select texture parts"
  static STYLE = [CSS]
  static TEMPLATE = TEMPLATE
  static BUTTONS = [CANCEL, CONFIRM]

  async init(root, { url } = {}) {
    const partsNode = root.querySelector("#parts")
    const cordsNode = root.querySelector("#cords")
    const selectorNode = root.querySelector("#selector")

    
    const imgNode = root.querySelector("img")
    const videoNode = root.querySelector("video")
    videoNode.controls = false

    if (VideoTexture.isThisTexture({url})) {
      videoNode.src = url
      videoNode.classList.add("active")
      videoNode.play()
    } else {
      videoNode.classList.remove("active")
      videoNode.pause()
    }
    
    if (ImageTexture.isThisTexture({url})) {
      imgNode.src = url
      imgNode.classList.add("active")
    } else {
      imgNode.classList.remove("active")
    }

    const getData = (parts, part) => {
      const w = 1 / parts
      const x = part * w
      cordsNode.value = `${x},0,${x+w},0,${x+w},1,${x},1`
    }

    partsNode.addEventListener("input", () => {
      const parts = Number.parseInt(partsNode.value)
      selectorNode.innerHTML = ""
      if (parts > 1) {
        for (let i = 0; i < parts; i++) {
          const span = document.createElement("span")
          span.addEventListener("click", () => getData(parts, i))
          selectorNode.appendChild(span)
        }
        return
      }
      cordsNode.value = "0,0,1,0,1,1,0,1"
    }, { passive: true })

  }

  async onSubmit(returnValue, data) {
    const cords = data?.cords
    if (returnValue !== CONFIRM || !cords) { return undefined }
    return cords.split(",").map(v => Number.parseFloat(v))
  }
}

customElements.define("ss-dialog-texture", TextureDialog)
