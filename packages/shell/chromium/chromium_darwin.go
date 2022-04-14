//go:build darwin

package chromium

import "log"

const (
  chromiumBinary = "chrome"
  chromiumPath   = "./chromium"
)

func (c *Chromium) Kill() error {
  log.Printf("Chromium [Kill] Darwin OS not supported\n")
  return nil
}