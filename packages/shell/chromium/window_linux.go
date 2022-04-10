//go:build linux

package chromium

import (
	"log"
	"time"
)

type Window struct {
	Title string
}

func (w *Window) Visible() bool {
	log.Printf("Chromium [Window.Visible] Linux OS not supported yet\n")
	return true
}

func (w *Window) Main() bool {
	log.Printf("Chromium [Window.Main] Linux OS not supported yet\n")
	return true
}

func (w *Window) Close() {
	log.Printf("Chromium [Window.Close] Linux OS not supported yet\n")
}

func (w *Window) SendKeyPress(_ uint16) {
	log.Printf("Chromium [Window.SendKeyPress] Linux OS not supported\n")
}

func (c *Chromium) GetWindows() (*[]Window, error) {
	log.Printf("Chromium [GetWindows] Linux OS not supported yet\n")
	return nil, nil
}

func (c *Chromium) WaitWindows(timeout time.Duration) (*[]Window, error) {
	log.Printf("Chromium [WaitWindows] Linux OS not supported yet\n")
	return nil, nil
}

func (c *Chromium) WaitMainWindow(timeout time.Duration) (*Window, error) {
	log.Printf("Chromium [WaitMainWindow] Linux OS not supported yet\n")
	return nil, nil
}