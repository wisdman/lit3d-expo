
import { API } from "./services/api.mjs" 

import { ConfigComponent } from "./components/config/config.mjs"
import { PlayerComponent } from "./components/player/player.mjs"

const ID = Number.parseInt(window.location.hash.replace(/^#/,""))
if (Number.isNaN(ID) || ID <= 0) {
  document.body.appendChild(new ConfigComponent())
} else {
  const config = await new API().GetConfig()
  const { url = "" } = config.screens?.find(({ id }) => id === ID) ?? {}
  if (url) { document.body.appendChild(new PlayerComponent(url)) }
}
