
export class Keyboard extends Map {
  static SHORTCUTS = Symbol("SHORTCUTS")

  static root(key, alt, ctrl, meta, shift) {
    return `${alt ? "alt+" : ""}${ctrl ? "ctrl+" : ""}${meta ? "meta+" : ""}${shift ? "shift+" : ""}${key}`.toUpperCase()
  }

  static #listeners = []
  static add(listener) { this.#listeners.unshift(listener) }

  static #keyDown = (event) => {
    const { key, altKey:alt, ctrlKey:ctrl, metaKey:meta, shiftKey:shift } = event
    const caps = event.getModifierState("CapsLock")
    const root = this.root(key, alt, ctrl, meta, shift)
    if (this.#listeners.length <= 0) { return }
    for (const listener of this.#listeners) {
      if (listener.call(root, { key, alt, ctrl, meta, shift, caps })) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
    }
  }

  static { window.addEventListener("keydown", this.#keyDown, { capture: true }) }

  #isActive = Boolean()
  get active() { return this.#isActive }
  set active(isActive) { this.#isActive = Boolean(isActive) }

  #mode = ""
  get mode() { return this.#mode }
  set mode(mode) { this.#mode = String(mode).replace(/\s+/ig,"") }

  #subject = undefined

  constructor(subject, shortcuts) {
    super()
    this.#subject = subject
    this.#init(shortcuts)
    Keyboard.add(this)
  }

  #init = (fnList) => Object.entries(fnList).forEach(([key, fn]) => this.on(key, fn))

  on = (key, fn) => {
    key = key.toUpperCase()
    if (!(fn instanceof Function)) {
      throw new TypeError(`Keyboard [on]: "${key}" "${fn}" isn't a function`)
    }
    fn = fn.bind(this.#subject)
    this.set(key, [...(this.get(key) ?? []), fn])
  }

  off = (key, fn) => {
    key = key.toUpperCase()
    this.set(key, (this.get(key) ?? []).filter(iFn => iFn !== fn))
  }

  call = (root, args) => {
    const mode = this.#mode
    const key = `${mode ? `[${mode}]` : ""}${root}`.toUpperCase()
    if (!this.active) { return false }
    const fnArr = this.get(key) ?? []
    if (fnArr.length <= 0) { return false }
    fnArr.forEach(fn => fn(args))
    return true
  }
}
