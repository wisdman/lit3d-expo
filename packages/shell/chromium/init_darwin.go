//go:build darwin

package chromium

import "log"

func (c *Chromium) Init() error {
  log.Printf("Chromium [Init] Darwin OS not supported\n")
  return nil
}