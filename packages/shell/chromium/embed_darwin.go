//go:build darwin

package chromium

import (
	"log"
)

func (c *Chromium) Extract() error {
	log.Printf("Chromium [Extract] Darwin OS not supported\n")
	return nil
}