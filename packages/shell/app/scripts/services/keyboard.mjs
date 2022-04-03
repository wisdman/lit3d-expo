export class Keyboard {
  static root(key, alt, ctrl, meta, shift) {
    return `${alt ? "alt+" : ""}${ctrl ? "ctrl+" : ""}${meta ? "meta+" : ""}${shift ? "shift+" : ""}${key}`.toUpperCase()
  }

  #listeners = new Map()

  #active = false
  get active() { return this.#active }
  set active(value) {
    this.#active = Boolean(value)
    if (this.#active) {
      window.addEventListener("keydown", this.#keyDown, { capture: true })
    } else {
      window.removeEventListener("keydown", this.#keyDown, { capture: true })
    }
  }

  #keyDown = event => {
    const { altKey:alt, ctrlKey:ctrl, metaKey:meta, shiftKey:shift } = event
    const root = Keyboard.root(event.key, alt, ctrl, meta, shift)
    const listeners = this.#listeners.get(root) ?? []
    if (!listeners.length) return
    event.preventDefault()
    event.stopPropagation()
    listeners.forEach(fn => fn({ alt, ctrl, meta, shift }))
  }

  on = (key, fn) => {
    key = key.toUpperCase()
    this.#listeners.set(key, [...(this.#listeners.get(key) ?? []), fn])
  }

  off = (key, fn) => {
    key = key.toUpperCase()
    const listeners = this.#listeners.get(root) ?? new Map()
    if (!fn) { 
      this.#listeners.delete(key)
      return
    }
    this.#listeners.set(key, (this.#listeners.get(key) ?? []).filter(l => l !== fn))
  }

  once = (key, fn) => {
    const wrapper = () => {
      this.off(key, wrapper)
      fn()
    }
    this.on(key, wrapper)
  }

  wait = (key) => new Promise(resolve => this.once(key, resolve))
}
