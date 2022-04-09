package main

import (
	"fmt"
	"log"
	"os"

	"github.com/wisdman/lit3d-expo/packages/shell/chromium"
	// "github.com/wisdman/lit3d-expo/packages/shell/winapi"
)

var revision = "unknown"

func main() {
  fmt.Printf("Lit3D-shell %s\n", revision)
  log.Printf("Temp: %s\n", os.TempDir())

  browser, err := chromium.New(os.TempDir())
  if err != nil {
   log.Fatalf("Browser initialization error: %+v", err)
  }
  
  err = browser.Init()
  if err != nil {
   log.Fatalf("Browser init error: %+v", err)
  }


  // processes, err := winapi.EnumProcesses()
  // if err != nil {
  //   log.Fatalf("Chromium [GetWindows] Win API error: %+v", err) 
  // }

  // binary := strings.ToLower("chrome.exe")
  // cPids := []uint32{}
  // for _, p := range processes {
  //   if strings.ToLower(p.ExeFile()) == binary {
  //     cPids = append(cPids, p.ProcessID)
  //   }
  // }

  // log.Println(cPids)

}