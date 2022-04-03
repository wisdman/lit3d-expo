
import CSS from "./dialog.css" assert { type: "css" }

const DIALOGS = {
  "color": await import("./color.mjs"),
  "content": await import("./content.mjs"),
}

export class Dialog extends HTMLElement {

  #dialog = this.attachShadow({mode: "open"})
                .appendChild(document.createElement("dialog"))

  #form = this.#dialog.appendChild(document.createElement("form"))
  #submit = undefined

  constructor(type, options) {
    super()
    const {init, submit, style, template} = DIALOGS[type]
    this.shadowRoot.adoptedStyleSheets = [CSS, style]
    this.#form.method = "dialog"

    const templateNode = document.createElement("template")
    templateNode.innerHTML = template
    this.#form.appendChild(templateNode.content.cloneNode(true))
    this.#submit = submit
    init(this.#form, options)
  }

  modal = async () => {
    document.body.appendChild(this)
    this.#dialog.showModal()
    await new Promise(resolve => this.#dialog.addEventListener("close", resolve, { once: true }))
    this.remove()
    return await this.#submit(this.#dialog.returnValue, new FormData(this.#form))
  }
}

customElements.define("ss-dialog", Dialog)