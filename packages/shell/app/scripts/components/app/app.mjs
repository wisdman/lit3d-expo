
import CSS from "./app.css" assert { type: "css" }

export class AppComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }
}

customElements.define("ss-app", AppComponent)