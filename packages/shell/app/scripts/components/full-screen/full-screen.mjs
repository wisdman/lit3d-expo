

import CSS from "./full-screen.css" assert { type: "css" }

export class FullScreen extends HTMLElement {
  #node = undefined

  constructor(){
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }
}

customElements.define("ss-full-screen", FullScreen)