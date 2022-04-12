package chromium

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

func (c *Chromium) ReadUserConfig() (map[string]json.RawMessage, error) {
	configPath := filepath.Join(c.profilePath, "Preferences") 
	log.Printf("Chromium [ReadUserConfig] Reading user config from \"%s\"\n", configPath)
	
	file, err := os.OpenFile(configPath, os.O_RDONLY, 0644)
	if err != nil {
    return nil, fmt.Errorf("Chromium [ReadUserConfig] File error: %w", err)
  }
  defer file.Close()

  bytes, err := ioutil.ReadAll(file)

  var cfg map[string]json.RawMessage
  if err = json.Unmarshal(bytes, &cfg); err != nil {
    return nil, fmt.Errorf("Config [Read] JSON error: %w", err)
  }

	return cfg, nil
}
