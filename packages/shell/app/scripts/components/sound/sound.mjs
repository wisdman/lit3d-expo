
import { SoundList } from "/common/entities/sound-list.mjs"
import { API } from "../../services/api.mjs"

import { UrlDialog } from "./dialog-url.mjs"

import CSS from "./sound.css" assert { type: "css" }

export class SoundComponent extends HTMLElement {

  #api = new API()
  #soundList = new SoundList()


  #items = this.attachShadow({mode: "open"})
               .appendChild(document.createElement("div"))

  #addButton = this.shadowRoot
                   .appendChild(document.createElement("button"))

  #saveButton = this.shadowRoot
                    .appendChild(document.createElement("button"))

  #urlDialog = undefined

  constructor() {
    super()
    this.shadowRoot.adoptedStyleSheets = [CSS]

    this.#items.classList.add("items")
    this.#addButton.classList.add("add-button")
    this.#saveButton.classList.add("save-button")

    this.#addButton.innerText = "Add"
    this.#saveButton.innerText = "Save"

    this.#addButton.addEventListener("click", this.#createURL, { passive: true })
    this.#saveButton.addEventListener("click", this.#save, { passive: true })
  }

  #render = () => {
    this.#items.innerHTML = ""
    for (const item of this.#soundList) {
      const itemNode = document.createElement("div")
      itemNode.classList.add("item")

      const enableNode = document.createElement("input")
      enableNode.setAttribute("type", "checkbox")
      enableNode.checked = item.enable
      itemNode.appendChild(enableNode)
      enableNode.addEventListener("change", () => item.enable = enableNode.checked)

      const idNode = document.createElement("input")
      idNode.setAttribute("type", "text")
      idNode.value = item.id
      itemNode.appendChild(idNode)
      idNode.addEventListener("change", () => item.id = idNode.value)

      const titleNode = document.createElement("input")
      titleNode.setAttribute("type", "text")
      titleNode.value = item.title
      itemNode.appendChild(titleNode)
      titleNode.addEventListener("change", () => item.title = titleNode.value)

      const audioNode = document.createElement("audio")
      audioNode.controls = true
      audioNode.src = item.url
      audioNode.autoplay = false
      audioNode.volume = item.volume / 100
      audioNode.muted = item.muted
      audioNode.loop = true
      itemNode.appendChild(audioNode)
      audioNode.addEventListener("volumechange", () => item.volume = Math.floor(Number(audioNode.volume) * 100))

      const deleteBtn = document.createElement("button")
      deleteBtn.innerHTML = "DELETE"
      itemNode.appendChild(deleteBtn)
      deleteBtn.addEventListener("click", () => {
        this.#soundList.delete(item)
        this.#render()
      })

      this.#items.appendChild(itemNode)
      if (item.enable) audioNode.play()
    }
  }

  #createURL = async () => {
    this.#urlDialog = this.#urlDialog ?? new UrlDialog()
    const url = await this.#urlDialog.modal()
    if (url !== undefined) { 
      this.#soundList.new({ url })
      this.#render()
    }
  }

  #load = async () => {
    const sound = new SoundList(await this.#api.GetConfigContentSound())
    this.#soundList = sound
    this.#render()
  }

  #save = async () => {
    await this.#api.SetConfigContentSound(this.#soundList)
  }

  async connectedCallback() {
    await this.#load()
  }
}

customElements.define("ss-sound", SoundComponent)