//go:build windows

package chromium

import (
	"fmt"
	"log"
	"os/exec"
)

const (
  chromiumPath = "./chromium"
  chromiumBinary = "chrome.exe"
)

func (c *Chromium) Kill() error {
  log.Printf("Chromium [Kill] Killing all \"%s\"\n", c.binary)
  err := exec.Command("powershell", fmt.Sprintf("TASKKILL /F /IM %s /T", c.binary)).Run()
  if err != nil {
    return nil
  }
  return nil
}