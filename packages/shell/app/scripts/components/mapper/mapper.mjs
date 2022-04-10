
import CSS from "./mapper.css" assert { type: "css" }

export class MapperComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }
}

customElements.define("ss-mapper", MapperComponent)