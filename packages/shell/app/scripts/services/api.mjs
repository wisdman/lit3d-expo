
export const SELF_SERVER = window.location.origin

export const API_PATH = `${SELF_SERVER}/api` 
export const API_PATH_ID = `${API_PATH}/id`

export const API_PATH_CONFIG = `${API_PATH}/config`
export const API_PATH_CONFIG_MAPPING = `${API_PATH_CONFIG}/mapping`

export const API_PATH_CONTENT = `${API_PATH}/content`

export const API_PATH_MOUSE = `${API_PATH}/mouse`
export const API_PATH_MOUSE_CLICK = `${API_PATH_MOUSE}/click`

export const SHELL_ID = await (await fetch(API_PATH_ID)).text()
export const MAPPING_ID = window.location.hash.replace(/^#/,"").trim()

export const MouseClick = async (x, y) => {
  const rawResponse = await fetch(API_PATH_MOUSE_CLICK, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({x, y})
  })
}

export const GetConfigMappingByID = async () => 
  MAPPING_ID ? await (await fetch(`${API_PATH_CONFIG_MAPPING}/${MAPPING_ID}`)).json() : {}

export const SetConfigMappingByID = async (item) =>  {
  const { id } = item
  if (!id) {
    console.error(new Error(`API [SetConfigMappingByID] error: Mapping ID is empty`))
    return
  }

  try {
    await fetch(`${API_PATH_CONFIG_MAPPING}/${id}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(item)
    })
  } catch (err) {
    console.error(new Error(`API [SetConfigMappingByID] error: ${err}`))
  }
}
