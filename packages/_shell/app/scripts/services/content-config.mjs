
import { Content } from "/common/entities/content.mjs"
import { API_PATH_CONFIG, SHELL_ID, MAPPING_ID } from "./api.mjs"

export class Config extends Content {
  static #instance = new Config()
  get instance() { return this.#instance }
  set instance(config) { this.#instance = config instanceof Config ? config : undefined }

  constructor() {
    return (async () => {
      if (Config.#instance) { return await Config.instance }
      const config = await (await fetch(API_PATH_CONFIG)).json()
      super(config)
      return Config.instance = this
    })()
  }

  get shellId() { return SHELL_ID }
  get currentMappingId() { return MAPPING_ID }
  get currentMapping() { return super.mapping.find(({id}) => id === MAPPING_ID) }

  save() {
    console.log("TODO: CONFIG SAVE")
  }
}