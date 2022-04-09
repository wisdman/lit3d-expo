//go:build linux

package chromium

import "log"

func CloseWindow(name string) error {
	log.Printf("Chromium [CloseWindow] Linux OS not supported yet\n")
	return nil
}

func SendF11Key(name string) error {
	log.Printf("Chromium [SendF11Key] Linux OS not supported yet\n")
	return nil
}

func GetWindows() error {
	log.Printf("Chromium [GetWindows] Linux OS not supported yet\n")
	return nil
}