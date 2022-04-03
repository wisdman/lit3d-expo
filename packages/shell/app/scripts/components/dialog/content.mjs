
import CSS from "./content.css" assert { type: "css" }
export const style = CSS

export const template = await (await fetch(`${import.meta.url.replace(/[^\/]+$/, "")}content.tpl`)).text()

export const init = (form, { url = "", datalist = [] } = {}) => {
  form.querySelector("#url").value = url
  const datalistNode = form.querySelector("datalist")
  for (const value of datalist) {
    const option = document.createElement("option")
    option.value = value
    datalistNode.appendChild(option)
  }
}

export const submit = (returnValue, formData) => {
  if (!returnValue) return undefined
  const url = formData.get("url").trim()
  if (!url) return undefined
  return url
}
