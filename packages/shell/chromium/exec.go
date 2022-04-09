package chromium

import (
	"fmt"
	"os/exec"
)

func (c *Chromium) Command(url string, kioskMode bool) *exec.Cmd {
	args := []string{
		fmt.Sprintf("--user-data-dir=%s", c.dataPath),
		fmt.Sprintf("--profile-directory=%s", c.profile),
		"--autoplay-policy=no-user-gesture-required",
		"--disable-background-timer-throttling",
		"--disable-breakpad",
		"--disable-gesture-requirement-for-presentation",
		"--disable-logging",
		"--ignore-gpu-blacklist",
		"--no-default-browser-check",
	}

	if kioskMode {
		args = append(args, "--kiosk")
	}

	args = append(args, url)

	return exec.Command(c.binaryPath, args...)
}