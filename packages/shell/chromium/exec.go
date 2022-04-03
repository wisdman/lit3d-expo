package chromium

import (
	"fmt"
	"log"
	"os/exec"
	"runtime"
)

func (c *Chromium) Run(url string) error {
	cmd := c.Command(url)
  log.Printf("Chromium [Run] command: %s\n", cmd.String())

  if os := runtime.GOOS; os == "darwin" {
  	log.Printf("Chromium [Run] Darwin OS is not supported\n")
  	return nil
  }

  if err := cmd.Run(); err != nil {
		log.Printf("Chromium [Run] error: %+v\n", err)
		return err
	}

	return nil
}

func (c *Chromium) Command(url string) *exec.Cmd {
	return exec.Command(
		c.binaryPath,
		// fmt.Sprintf("--user-data-dir=\"%s\"", c.dataPath),
		fmt.Sprintf("--profile-directory=%s", c.profile),
		fmt.Sprintf("--window-position=%d,%d", 0, 0),
		"--disable-gesture-requirement-for-presentation",
		"--autoplay-policy=no-user-gesture-required",
		"--ignore-certificate-errors",
		fmt.Sprintf("--unsafely-treat-insecure-origin-as-secure=%s", url),
		"--no-default-browser-check",
		"-disable-logging",
		"--disable-breakpad",
		// "--kiosk",
		url,
	)
}
 