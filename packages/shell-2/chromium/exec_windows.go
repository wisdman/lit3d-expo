//go:build windows

package chromium

func (c *Chromium) Exec(url string, kioskMode bool) error {
	cmd := c.Command(url, kioskMode)
	log.Printf("Chromium [Run] Running command:\"%s\"", cmd.String())

  if err := cmd.Run(); err != nil {
		return fmt.Errorf("Chromium [Run] Running error: %+v\n", err)
	}

	return nil
}