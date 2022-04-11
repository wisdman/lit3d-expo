
export const SELF_SERVER = window.location.origin

const WINDOW_ID_RX = /^(?:\s*\[(?<id>[^\]]+)\])?(?<title>.*)/i

const INSTANCE = Symbol["INSTANCE"]

export class API {
  static get instance() { return this[INSTANCE] ?? undefined }
  static { this[INSTANCE] = new API() }

  static SERVER = window.location.origin
  static API    = `${this.SERVER}/api`
  
  static API_ID      = `${this.API}/id`
  static API_CHROME  = `${this.API}/chrome`
  static API_CONTENT = `${this.API}/content`
  static API_CONFIG  = `${this.API}/config`
 
  static API_CHROME_F11 = `${this.API_CHROME}/f11`

  static API_CONFIG_CONTENT = `${this.API_CONFIG}/content`
  static API_CONFIG_THEME   = `${this.API_CONFIG}/theme`
  
  static API_CONFIG_CONTENT_EXEC    = `${this.API_CONFIG_CONTENT}/exec`
  static API_CONFIG_CONTENT_KIOSK   = `${this.API_CONFIG_CONTENT}/kiosk`
  static API_CONFIG_CONTENT_MAPPING = `${this.API_CONFIG_CONTENT}/mapping`
  static API_CONFIG_CONTENT_SOUND   = `${this.API_CONFIG_CONTENT}/sound`
  
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
  SetWindowID(id) { this.#setDocumentTitle(id, this.GetWindowTitle())  }

  GetWindowTitle() { return WINDOW_ID_RX.exec(document.title)?.groups?.title?.trim() ?? "" }
  SetWindowTitle(title) { this.#setDocumentTitle(this.GetWindowID(), title) }

  async ChromeF11(windowId = null) { 
    if (typeof windowId !== "string") {
      throw TypeError(`API [ChromeF11] Window id "${windowId}" isn't string value`)
    }

    try { 
      await (await fetch(`${this.class.API_CHROME_F11}/${windowId}`)).json()
      return true
    } catch (err) {
      console.error(`API [GetContent] fetch error: ${err}`)
      return false
    }
  }

  // === Content List ===

  async GetContent() {
    try { 
      return await (await fetch(`${this.class.API_CONTENT}`)).json()
    } catch (err) {
      console.error(`API [GetContent] fetch error: ${err}`)
      return []
    }
  }

  // === Config ===

  async GetConfig() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG}`)).json()
    } catch (err) {
      console.error(`API [GetConfig] fetch error: ${err}`)
      return {}
    }
  }

  async GetConfigContent() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG_CONTENT}`)).json()
    } catch (err) {
      console.error(`API [GetConfigContent] fetch error: ${err}`)
      return {}
    }
  }

  async GetConfigTheme() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG_THEME}`)).text()
    } catch (err) {
      console.error(`API [GetConfigTheme] fetch error: ${err}`)
      return ""
    }
  }

  // === Exex ===

  async GetConfigContentExec() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG_CONTENT_EXEC}`)).json()
    } catch (err) {
      console.error(`API [GetConfigContentExec] fetch error: ${err}`)
      return []
    }
  }

  // === Kiosk ===

  async GetConfigContentKiosk() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG_CONTENT_KIOSK}`)).json()
    } catch (err) {
      console.error(`API [GetConfigContentKiosk] fetch error: ${err}`)
      return []
    }
  }

  // === Mapping ===

  async GetConfigContentMapping() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG_CONTENT_MAPPING}`)).json()
    } catch (err) {
      console.error(`API [GetConfigContentMapping] fetch error: ${err}`)
      return []
    }
  }

  async GetConfigContentMappingByID(id = this.GetContentID()) {
    if (typeof id !== "string") {
      throw TypeError(`API [GetConfigMappingByID] Mapping id "${id}" isn't string value`)
    }
    
    if (id.length === 0) {
      throw TypeError(`API [GetConfigMappingByID] Mapping id "${id}" is an empty string`)
    } 

    try { 
      return await (await fetch(`${this.class.API_CONFIG_CONTENT_MAPPING}/${id}`)).json()
    } catch (err) {
      console.error(`API [GetConfigMappingByID] fetch error: ${err}`)
      return { id: this.GetContentID() }
    }
  } 

  async SetConfigContentMappingByID(item = {}) {
    const { id } = item
    if (typeof id !== "string") {
      throw TypeError(`API [SetConfigMappingByID] Item "${JSON.stringify(item)}" Id isn't string value`)
    }

    try { 
      await fetch(`${this.class.API_CONFIG_CONTENT_MAPPING}/${id}`, {
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

  // === Sound ===

  async GetConfigContentSound() {
    try { 
      return await (await fetch(`${this.class.API_CONFIG_CONTENT_SOUND}`)).json()
    } catch (err) {
      console.error(`API [GetConfigContentSound] fetch error: ${err}`)
      return []
    }
  }
}