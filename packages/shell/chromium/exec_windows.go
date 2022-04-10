//go:build windows

package chromium

import (
	"fmt"
	"log"
)

func (c *Chromium) Run(url string, kioskMode bool) error {
	cmd := c.Command(url, kioskMode)
	log.Printf("Chromium [Run] Running command:\"%s\"\n", cmd.String())

  if err := cmd.Run(); err != nil {
		return fmt.Errorf("Chromium [Run] Running error: %w", err)
	}

	return nil
}