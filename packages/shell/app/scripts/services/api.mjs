
export const SELF_SERVER = window.location.origin

const INSTANCE = Symbol["INSTANCE"]
const WINDOW_ID_RX = /^(?:\s*\[(?<id>[^\]]+)\])?(?<title>.*)/i

export class API {
  static [INSTANCE] = await new API()

  static SERVER             = window.location.origin
  static API                = `${this.SERVER}/api`
  static API_ID             = `${this.API}/id`
  static API_CONFIG         = `${this.API}/config`
  static API_CONFIG_MAPPING = `${API_CONFIG}/mapping`
  static API_CONTENT        = `${this.API}/content`
  static API_CHROME_KEY     = `${this.API}/chrome/key`

  get class() { return Object.getPrototypeOf(this).constructor }
  constructor() { return this.class[INSTANCE] ?? this }

  // === Global ID ===
  
  async GetShellID() {
    try {
      return await (await fetch(this.class.API_ID)).text()
    } catch (err) {
      console.error(`API [ShellID] fetch error: ${err}`)
      return null
    }
  }
  
  GetContentID() { return window.location.hash.replace(/^#/,"").trim() }

  // === Window & Broeser ===

  #setDocumentTitle = (id, title) => document.title = `${id ? `[${id}]` : ""}${title}`

  GetWindowID() { return WINDOW_ID_RX.exec(document.title)?.groups?.id?.trim() ?? "" }
  SetWindowID(id) { this.#setDocumentTitle(id, this.WindowTitle)  }

  GetWindowTitle() { return WINDOW_ID_RX.exec(document.title)?.groups?.title?.trim() ?? "" }
  SetWindowTitle(title) { this.#setDocumentTitle(this.WindowID, title) }

  ChromeKeyPress(windowId, key) { 
    if (typeof key !== "string") {
      throw TypeError(`API [WindowKeyPress] Key "${id}" isn't string value`)
    }

    if (id.length === 0) {
      throw TypeError(`API [WindowKeyPress] Key "${id}" is an empty string`)
    } 

    try {
      await fetch(this.class.API_CHROME_KEY, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ windowId, key })
      })
    } catch (err) {
      console.error(`API [WindowKeyPress] fetch error: ${err}`)
      return false
    }
  }

  // === Mapper ===

  async GetConfigMappingByID(id = null) {
    if (typeof id !== "string") {
      throw TypeError(`API [GetConfigMappingByID] Mapping id "${id}" isn't string value`)
    }
    
    if (id.length === 0) {
      throw TypeError(`API [GetConfigMappingByID] Mapping id "${id}" is an empty string`)
    } 

    try { 
      return await (await fetch(`${this.class.API_CONFIG_MAPPING}/${id}`)).json()
    } catch (err) {
      console.error(`API [GetConfigMappingByID] fetch error: ${err}`)
      return {}
    }
  } 

  async SetConfigMappingByID(item = {}) {
    const { id } = item
    if (typeof id !== "string") {
      throw TypeError(`API [SetConfigMappingByID] Item "${JSON.stringify(item)}" Id isn't string value`)
    }

    try { 
      await fetch(`${this.class.API_CONFIG_MAPPING}/${id}`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(item)
      })
      return true
    } catch (err) {
      console.error(`API [SetConfigMappingByID] fetch error: ${err}`)
      return false
    }
  }
}