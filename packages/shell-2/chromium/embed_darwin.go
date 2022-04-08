//go:build darwin

package chromium

import (
	"log"
)

func (c *Chromium) Extract() error {
	log.Printf("Chromium [Extract] Extract Chromium to dir \"%s\"", c.path)
	log.Printf("Chromium [Extract] Darwin OS not supported")
	return nil
}