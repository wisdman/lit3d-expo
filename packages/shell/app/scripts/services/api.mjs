export const SELF_SERVER = window.location.origin

export const API_PATH = `${SELF_SERVER}/api` 
export const API_PATH_ID = `${API_PATH}/id`
export const API_PATH_CONFIG = `${API_PATH}/config`
export const API_PATH_CONTENT = `${API_PATH}/content`
export const API_PATH_MOUSE = `${API_PATH}/mouse`
export const API_PATH_MOUSE_CLICK = `${API_PATH_MOUSE}/click`


export const ID = await (await fetch(API_PATH_ID)).text()
export const MAPPING_ID = Number.parseInt(window.location.hash.replace(/^#/,"") || -1)
