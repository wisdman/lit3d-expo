
import { Texture } from "./texture.mjs"

export class VideoTexture extends Texture {
  static #cache = new Map()

  static async fetch(url) {
    if (!this.#cache.has(url)) {
      const blob = await (await fetch(url, { method: "GET", cache: "no-cache" })).blob()
      const data = URL.createObjectURL(blob)
      this.#cache.set(url, data)
    }
    return this.#cache.get(url)
  }

  static clean() { this.#cache.clear() }

  #video = document.createElement("video")
  get source() { return this.#video }

  #url = undefined
  get url() { return this.#url }

  get volume() { 
    return Math.floor(this.#video.volume * 100)
  }
  set volume(volume) {
    this.#video.volume = volume / 100
    this.#video.muted = volume <= 0
  }

  play = () => {
    this.#video.currentTime = 0;
    this.#video.play()
  }

  pause = () => this.#video.pause()

  constructor(gl, id, {
    url = undefined,
    volume = 0,
  } = {}){
    super(gl, gl.RGB, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0]), id)
    this.#url = url

    this.#video.loop = true
    this.#video.controls = false
    this.#video.autoplay = false

    this.volume = volume

    return new Promise(async resolve => {
      this.#video.addEventListener("canplaythrough", () => resolve(this))
      this.#video.src = await VideoTexture.fetch(this.#url)
    })
  }

  toJSON() {
    return {
      ...super.toJSON(),
      url: this.#url,
      volume: this.volume
    }
  }
}
