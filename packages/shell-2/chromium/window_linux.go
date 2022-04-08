//go:build linux

package chromium

import "log"

func CloseWindow(name string) error {
	log.Printf("Chromium [CloseWindow] Linux OS not supported")
	return nil
}

func SendF11Key(name string) error {
	log.Printf("Chromium [SendKey] Linux OS not supported")
	return nil
}
