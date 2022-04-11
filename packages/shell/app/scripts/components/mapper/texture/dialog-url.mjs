
import { API } from "../../../services/api.mjs"

import { Dialog } from "../../dialog/dialog.mjs"

import { VideoTexture, ImageTexture } from "./texture.mjs"

const CURRENT_PATH = import.meta.url.replace(/[^\/]+$/, "")

const DEFAULT_CONTENT_LIST = [
  new URL(`${CURRENT_PATH}pattern.avif`).pathname,
  new URL(`${CURRENT_PATH}pattern.mkv`).pathname
]

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
    const contentList = [...DEFAULT_CONTENT_LIST, ...(await this.#api.GetContent())]
    const selectNode = root.querySelector("select")
    for (const value of contentList) {
      const option = document.createElement("option")
      option.value = value
      option.innerHTML = value
      selectNode.appendChild(option)
    }

    const imgNode = root.querySelector("img")
    const videoNode = root.querySelector("video")
    videoNode.controls = false

    selectNode.addEventListener("keydown", ({key}) => key.toUpperCase() === "ENTER" && this.submit(CONFIRM))

    selectNode.addEventListener("change", () => {
      const url = selectNode.value

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
    })
    selectNode.dispatchEvent(new Event("change"))
  }

  async onSubmit(returnValue, data) {
    return returnValue === CONFIRM && data?.url || undefined 
  }
}

customElements.define("ss-dialog-url", UrlDialog)
