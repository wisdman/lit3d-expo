//go:build darwin

package chromium

import "log"

func CloseWindow(name string) error {
	log.Printf("Chromium [CloseWindow] Darwin OS not supported")
	return nil
}

func SendF11Key(name string) error {
	log.Printf("Chromium [SendKey] Darwin OS not supported")
	return nil
}
