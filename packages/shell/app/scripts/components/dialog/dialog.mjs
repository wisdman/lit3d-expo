
import CSS from "./dialog.css" assert { type: "css" }

export class Dialog extends HTMLElement {
  static TYTLE = "Default dialog"
  get title() { return Object.getPrototypeOf(this).constructor.TYTLE }

  static STYLE = []
  get styles() { return Object.getPrototypeOf(this).constructor.STYLE }

  static TEMPLATE = undefined
  get template() { return Object.getPrototypeOf(this).constructor.TEMPLATE }

  static BUTTONS = []
  get buttons() { return Object.getPrototypeOf(this).constructor.BUTTONS }

  #dialog = this.attachShadow({mode: "open"})
                .appendChild(document.createElement("dialog"))

  #form = this.#dialog.appendChild(document.createElement("form"))
  
  #title = this.#form.appendChild(document.createElement("h1"))

  #section = this.#form.appendChild(document.createElement("section"))
  get section() { return this.#section }
  
  #menu = this.#form.appendChild(document.createElement("menu"))

  #template = document.createElement("template")

  constructor() {
    super()
    this.#form.method = "dialog"
    this.#title.innerText = this.title
    this.shadowRoot.adoptedStyleSheets = [CSS, ...this.styles]

    this.#template.innerHTML = this.template ?? ""
    
    this.buttons.forEach(text => {
      const btn = this.#menu.appendChild(document.createElement("button"))
      btn.type="submit"
      btn.innerText = text
      btn.value = text
    })
  }

  #submitValue = undefined
  submit = (value) => {
    this.#submitValue = value
    this.#form.submit()
  }

  async init() { }
  async onSubmit() { return undefined }

  connectedCallback() {
    
  }

  async modal(...args) {
    this.#section.appendChild(this.#template.content.cloneNode(true))
    document.body.appendChild(this)
    
    this.#dialog.returnValue = ""
    this.#submitValue = undefined
    
    await this.init(this.section, ...args)

    this.#dialog.showModal()
    await new Promise(resolve => this.#dialog.addEventListener("close", resolve, { once: true }))
    this.remove()
    
    const returnValue = this.#dialog.returnValue || this.#submitValue || this.buttons[0] || ""
    const data = Object.fromEntries(new FormData(this.#form))
    
    this.#section.innerHTML = ""
    
    return await this.onSubmit(returnValue, data)
  }
}

customElements.define("ss-dialog", Dialog)
