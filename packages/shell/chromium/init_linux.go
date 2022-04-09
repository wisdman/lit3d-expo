//go:build linux

package chromium

import "log"

func (c *Chromium) Init() error {
  log.Printf("Chromium [Init] Linux OS not supported yet\n")
  return nil
}