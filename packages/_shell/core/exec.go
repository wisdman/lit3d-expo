package core

import (
	"fmt"
	"log"

	"github.com/wisdman/lit3d-expo/packages/shell/screen"
)

func (c *Core) Run() {
  log.Printf("Core [Run]: Start slave process\n")
  c.chromium.Run("https://localhost")
}

func (c *Core) Multiscreen() {
  log.Printf("Core [Multiscreen]: Start slave process\n")

  

  locations := screen.GetLocations()
  log.Printf("Core [Multiscreen] locations: %v\n", locations)

  for i, l := range locations {
    c.chromium.Kiosk(i, l, fmt.Sprintf("https://localhost/mapping.html#%d", i))
  }

}