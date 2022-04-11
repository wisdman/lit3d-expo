
import { API } from "../../services/api.mjs"

import { Mapping } from "/common/entities/mapping.mjs"

const INIT_CONFIG = await GetConfigMappingByID()
const { left:x, top:y} = (await window.getScreenDetails()).currentScreen

export class Config extends Mapping {
  #api = new API()

  constructor() {
    super(INIT_CONFIG)
    this.location = [x, y]
  }

  get raw() { return JSON.parse(JSON.stringify(this)) }
  
  async save() { 
    console.log(JSON.parse(JSON.stringify(this)))
    await SetConfigMappingByID(this)
  }
}
