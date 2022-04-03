package chromium

import (
	"fmt"
	"log"
	"os/exec"
	"path/filepath"
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
		fmt.Sprintf("--unsafely-treat-insecure-origin-as-secure=%s", url),
		"--no-default-browser-check",
		"-disable-logging",
		"--disable-breakpad",
		url,
	)
}

func (c *Chromium) Kiosk(id int, location [2]int16, url string) error {
	cmd := c.KioskCommand(id, location, url)
  log.Printf("Chromium [Run] command: %s\n", cmd.String())

  if os := runtime.GOOS; os == "darwin" {
  	log.Printf("Chromium [Run] Darwin OS is not supported\n")
  	return nil
  }

  if err := cmd.Start(); err != nil {
		log.Printf("Chromium [Run] error: %+v\n", err)
		return nil
	}

	return nil
}

func (c *Chromium) KioskCommand(id int, location [2]int16, url string) *exec.Cmd {
	dataPathAbs, err := filepath.Abs(filepath.Join(c.dataPath, fmt.Sprintf("/%d", id)))
	if err != nil {
		log.Fatalf("Chromium [KioskCommand] Incorrect data path: %v\n", err)
	}
	return exec.Command(
		c.binaryPath,
		fmt.Sprintf("--user-data-dir=%s", dataPathAbs),
		fmt.Sprintf("--profile-directory=%s", c.profile),
		fmt.Sprintf("--window-position=%d,%d", location[0], location[1]),
		"--disable-gesture-requirement-for-presentation",
		"--autoplay-policy=no-user-gesture-required",
		fmt.Sprintf("--unsafely-treat-insecure-origin-as-secure=%s", url),
		"--no-default-browser-check",
		"-disable-logging",
		"--disable-breakpad",
		"--kiosk",
		url,
	)
}
 