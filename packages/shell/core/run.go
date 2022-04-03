package core

import (
	"encoding/json"
	"fmt"
	"log"
)

func Run() {
	config := GetContentConfig()

	b, err := json.Marshal(config)
  if err != nil {
    log.Printf("Config marshal error: %+v\n", err)
  } else {
    log.Printf("Config: %+v\n", string(b))
  }

  if config.Exec != nil {
  	log.Printf("Exec: %s\n", *config.Exec)
  }

  if config.Mapping != nil && len(*config.Mapping) > 0 {
  	log.Printf("Mapping: %s\n", *config.Mapping)

  	ClearChromeDataPath()
  	for num, value := range *config.Mapping {
  		log.Printf("Run Chrome with url https://localhost#%d\n", num)
  		Chrome(
        fmt.Sprintf("https://localhost#%d", num),
        uint8(num),
        value.Location[0],
        value.Location[1],
      )
  	}
  }

  if config.Sound != nil && len(*config.Sound) > 0 {
  	log.Printf("Sound: %s\n", *config.Sound)
  }
}
