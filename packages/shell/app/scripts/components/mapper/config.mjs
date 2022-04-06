
import { GetConfigMappingByID, SetConfigMappingByID } from "../../services/api.mjs"

import { Mapping } from "/common/entities/mapping.mjs"

const INIT_CONFIG = await GetConfigMappingByID()

export class Config extends Mapping {
  constructor() {
    super(INIT_CONFIG)
    console.dir(JSON.stringify(new Mapping(INIT_CONFIG)))
  }

  get raw() { return JSON.parse(JSON.stringify(this)) }
  
  async save() { 
    console.log(JSON.parse(JSON.stringify(this)))
    await SetConfigMappingByID(this)
  }
}
