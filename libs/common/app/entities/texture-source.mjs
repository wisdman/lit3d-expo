
export class TextureSource {
  constructor(url) {
    if (TextureVideoSource.isVideoSource(url)) return new TextureVideoSource(url)
    if (TextureImageSource.isImageSource(url)) return new TextureImageSource(url)
  }
}

const EXT_RX = /\.(?<ext>[^\.]+)$/

const VIDEO_EXT = ["mkv", "mp4", "webm"]
export class TextureVideoSource extends TextureSource {
  static isVideoSource = ({ url } = {}) => VIDEO_EXT.includes(EXT_RX.exec("." + url)?.groups?.ext)
  #source = document.createElement("video")
  get source() { return this.#source }
}

const IMAGE_EXT = ["avif", "jpg", "jpeg", "png", "webp"]
export class TextureImageSource extends TextureSource {
  static isImageSource = ({ url } = {}) => IMAGE_EXT.includes(EXT_RX.exec("." + url)?.groups?.ext)
  #source = new Image()
  get source() { return this.#source }
}