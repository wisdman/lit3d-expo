//go:build darwin

package chromium

import "log"

func (c *Chromium) Run(url string, kioskMode bool) error {
	cmd := c.Command(url, kioskMode)
	log.Printf("Chromium [Run] Running command:\"%s\"\n", cmd.String())
	log.Printf("Chromium [Run] Darwin OS not supported\n")
	return nil
}