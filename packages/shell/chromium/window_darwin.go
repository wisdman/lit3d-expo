//go:build darwin

package chromium

import (
	"log"
	"time"
)

type Window struct {
	Title string
}

func (w *Window) Visible() bool {
	log.Printf("Chromium [Window.Visible] Darwin OS not supported\n")
	return true
}

func (w *Window) Main() bool {
	log.Printf("Chromium [Window.Main] Darwin OS not supported\n")
	return true
}

func (w *Window) Close() {
	log.Printf("Chromium [Window.Close] Darwin OS not supported\n")
}

func (w *Window) SendKeyPress(_ uint16) {
	log.Printf("Chromium [Window.SendF11Key] Darwin OS not supported\n")
}

func (w *Window) SetForeground() {
	log.Printf("Chromium [Window.SetForeground] Darwin OS not supported\n")
}

func (c *Chromium) GetWindows() (*[]Window, error) {
	log.Printf("Chromium [GetWindows] Darwin OS not supported\n")
	return nil, nil
}

func (c *Chromium) WaitWindows(timeout time.Duration) (*[]Window, error) {
	log.Printf("Chromium [WaitWindows] Darwin OS not supported\n")
	return nil, nil
}

func (c *Chromium) WaitMainWindow(timeout time.Duration) (*Window, error) {
	log.Printf("Chromium [WaitMainWindow] Darwin OS not supported\n")
	return nil, nil
}