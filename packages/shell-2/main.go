package main

import (
	"fmt"
	"log"
	"os"

	"github.com/wisdman/lit3d-expo/packages/shell-2/chromium"
)

var revision = "unknown"

func main() {
	fmt.Printf("Lit3D-shell %s\n", revision)

	browser, err := chromium.New(os.TempDir())
	if err != nil {
		log.Fatalf("Browser initialization error. %+v", err)
	}
	
	browser.Extract()
	
}