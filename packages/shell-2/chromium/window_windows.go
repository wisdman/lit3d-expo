//go:build windows

package chromium

import "log"

func CloseWindow(name string) error {
	log.Printf("Chromium [CloseWindow] Windows OS not supported")
	return nil
}

func SendF11Key(name string) error {
	log.Printf("Chromium [SendKey] Windows OS not supported")
	return nil
}