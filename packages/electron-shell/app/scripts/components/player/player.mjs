
import CSS from "./player.css" assert { type: "css" }

const EXT_RX = /\.(?<ext>[^\.]+)$/
const VIDEO_EXT = ["mkv", "mp4", "webm"]
const IMAGE_EXT = ["avif", "jpg", "jpeg", "png", "webp"]

export class PlayerComponent extends HTMLElement {
  static allowExtension = [...VIDEO_EXT, ...IMAGE_EXT]

  static isVideoTexture(url = "") { return VIDEO_EXT.includes(EXT_RX.exec("." + url)?.groups?.ext) }
  static isImageTexture(url = "") { return IMAGE_EXT.includes(EXT_RX.exec("." + url)?.groups?.ext) }

  #video = document.createElement("video")
  #image = document.createElement("img")
  #url = ""
  set url(url) {
    this.#url = url
    this.#render(this.#url)
  }
  get url() { return this.#url }

  constructor(url = ""){
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]

    this.#video.controls = false
    this.#video.autoplay = false
    this.#video.volume = 0
    this.#video.muted = true
    this.#video.loop = true

    this.url = url
  }

  #render(url = "") {
    this.#video.pause()
    this.shadowRoot.innerHTML = ""

    if (!url) { return }

    if (PlayerComponent.isVideoTexture(url)) {
      this.#video.src = url
      this.shadowRoot.appendChild(this.#video)
      this.#video.play()
      return
    }

    if (PlayerComponent.isImageTexture(url)) {
      this.#image.src = url
      this.shadowRoot.appendChild(this.#image)
      return
    }

    console.error(`Incorrect Player URL "${url}"`)
  }
}

customElements.define("ss-player", PlayerComponent)