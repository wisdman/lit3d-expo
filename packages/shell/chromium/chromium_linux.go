//go:build linux

package chromium

import "log"

const (
  chromiumBinary = "chrome"
)

func (c *Chromium) Kill() error {
  log.Printf("Chromium [Kill] Linux OS not supported yet\n")
  return nil
}