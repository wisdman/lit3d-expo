
const INSTANCE = Symbol["INSTANCE"]

const EXT_RX = /\.(?<ext>[^\.]+)$/

export class API {
  static get instance() { return this[INSTANCE] ?? undefined }
  static { this[INSTANCE] = new API() }

  static SERVER = window.location.origin
  static API    = `${this.SERVER}/api`

  static API_CONFIG = `${this.API}/config`
  static API_UPLOAD = `${this.API}/upload`

  get class() { return Object.getPrototypeOf(this).constructor }
  constructor() { return this.class[INSTANCE] ?? this }

  // === Config ===

  async GetConfig() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG}`)).json()
    } catch (err) {
      console.error(`API [GetConfig] fetch error: ${err}`)
      return {}
    }
  }

  async SetConfig(config = {}) {
    try { 
      const response = await fetch(this.class.API_CONFIG, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(config)
      })
      return true
    } catch (err) {
      console.error(`API [SetConfig] fetch error: ${err}`)
      return false
    }
  }

  // === Content upload ===

  async Upload(body = null) {
    if (body === null) { return null }
    try { 
      const extension = EXT_RX.exec("." + body.name)?.groups?.ext?.toLowerCase()
      const response = await fetch(this.class.API_UPLOAD, {
        headers: { "extension": extension },
        method: "POST",
        cache: "no-cache",
        body
      })

      const filename = await response.text()
      return filename
    } catch (err) {
      console.error(`API [Upload] fetch error: ${err}`)
      return null
    }
  }
}