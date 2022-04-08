//go:build linux

package chromium

import "log"

func (c *Chromium) Exec(url string, kioskMode bool) error {
	cmd := c.Command(url, kioskMode)
	log.Printf("Chromium [Run] Running command:\"%s\"", cmd.String())
	log.Printf("Chromium [Run] Linux OS not supported")
	return nil
}