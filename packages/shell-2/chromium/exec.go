package chromium

import (
	"fmt"
	"os/exec"
)

func kioskFlag(isKioskMode bool) string {
	if isKioskMode {
  	return "--kiosk"
  }
  return ""
}

func (c *Chromium) Command(url string, kioskMode bool) *exec.Cmd {
	return exec.Command(
		c.binaryPath,
		fmt.Sprintf("--user-data-dir=%s", c.dataPath),
		fmt.Sprintf("--profile-directory=%s", c.profile),
		"--autoplay-policy=no-user-gesture-required",
		"--disable-breakpad",
		"--disable-gesture-requirement-for-presentation",
		"--disable-logging",
		"--no-default-browser-check",
		kioskFlag(kioskMode),
		url,
	)
}