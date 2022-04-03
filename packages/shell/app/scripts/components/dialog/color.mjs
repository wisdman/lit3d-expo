
import CSS from "./color.css" assert { type: "css" }
export const style = CSS

export const template = await (await fetch(`${import.meta.url.replace(/[^\/]+$/, "")}color.tpl`)).text()

const COLOR_RX = /^#?(?<r>[0-9a-f]{2})(?<g>[0-9a-f]{2})(?<b>[0-9a-f]{2})/i

export const init = (form, { color = [0, 0, 0] } = {}) => {
  const colorNode = form.querySelector("#picker")
  const labelNode = form.querySelector("#label")
  colorNode.addEventListener("input", () => labelNode.innerText = colorNode.value, { passive: true })
  labelNode.innerText = colorNode.value = `#${color.map(v => v.toString(16)).join("")}`
}

export const submit = (returnValue, formData) => {
  if (!returnValue) return undefined
  const {r = "00", g = "00", b = "00"} = COLOR_RX.exec(formData.get("color"))?.groups ?? {}
  return [Number.parseInt(r,16), Number.parseInt(g,16), Number.parseInt(b,16)]
}

