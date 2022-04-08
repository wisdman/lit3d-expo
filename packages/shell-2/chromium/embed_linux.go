//go:build linux

package chromium

import (
	"log"
)

func (c *Chromium) Extract() error {
	log.Printf("Chromium [Extract] Extract Chromium to dir \"%s\"", c.path)
	log.Printf("Chromium [Extract] Linux OS not supported")
	return nil
}