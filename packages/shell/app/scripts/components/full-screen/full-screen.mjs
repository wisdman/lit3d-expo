
import CSS from "./full-screen.css" assert { type: "css" }

export class FullScreenComponent extends HTMLElement {
  constructor(){
    super()
    this.attachShadow({mode: "open"}).adoptedStyleSheets = [CSS]
  }

  #fullscreen = async () => {
    await new Promise(resolve => setTimeout(resolve, Math.random()*1000))
    const screen = (await window.getScreenDetails()).currentScreen
    window.addEventListener("pointerdown", async () => {
      await document.body.requestFullscreen({ screen })
    }, { once: true, capture: true })
    const { left, top } = screen
    // TODO: Detect window position
    await MouseClick(left + 200, top + 200)
  }

  async connectedCallback() {
    // await this.#fullscreen()
    // this.shadowRoot.appendChild(new Mapper())
  }
}

customElements.define("ss-full-screen", FullScreenComponent)