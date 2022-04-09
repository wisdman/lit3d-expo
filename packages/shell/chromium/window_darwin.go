//go:build darwin

package chromium

import "log"

func CloseWindow(name string) error {
	log.Printf("Chromium [CloseWindow] Darwin OS not supported\n")
	return nil
}

func SendF11Key(name string) error {
	log.Printf("Chromium [SendF11Key] Darwin OS not supported\n")
	return nil
}

func GetWindows() error {
	log.Printf("Chromium [GetWindows] Darwin OS not supported\n")
	return nil
}
