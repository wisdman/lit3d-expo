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

func (w *Window) F11() {
	log.Printf("Chromium [Window.F11] Darwin OS not supported\n")
}

func (c *Chromium) GetWindows() (*[]Window, error) {
	log.Printf("Chromium [GetWindows] Darwin OS not supported\n")
	return nil, nil
}

func (c *Chromium) FindWindowPrifix(prefix string) (*Window, error) {
	return &Window{}, nil
}

func (c *Chromium) WaitWindows(timeout time.Duration) (*[]Window, error) {
	log.Printf("Chromium [WaitWindows] Darwin OS not supported\n")
	return nil, nil
}

func (c *Chromium) WaitMainWindow(timeout time.Duration) (*Window, error) {
	log.Printf("Chromium [WaitMainWindow] Darwin OS not supported\n")
	return nil, nil
}

