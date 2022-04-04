package main

import (
	"flag"
	"fmt"

	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/wisdman/lit3d-expo/libs/service"

	"github.com/wisdman/lit3d-expo/packages/shell/api"
	"github.com/wisdman/lit3d-expo/packages/shell/core"
)

var revision = "unknown"

func main() {
  fmt.Printf("Lit3D-shell %s\n", revision)

  var configStr string
  flag.StringVar(&configStr, "cfg", "", "Custom config JSON")
  debug := flag.Bool("d", false, "Print log to stdout")
  flag.Parse()

  if *debug != true {
    logPath := getLogFilePath()
    logFile, err := os.OpenFile(logPath, os.O_RDWR | os.O_CREATE | os.O_APPEND, 0666)
    if err != nil {
      log.Fatalf("Opening log file error: %+v\n", err)
    }
    defer logFile.Close()
    log.SetOutput(logFile)
  }

  config := NewConfig(configStr)
  config.Print()

  core := core.New(config.GetID(), config.ContentPath)
  core.Print()

  srv := service.New(config.SSLCert, config.SSLKey)

  api := &api.API{ srv.API("/api"), core}
  api.GET("/id", api.GetID)
  api.GET("/theme", api.GetTheme)
  api.GET("/content", api.ListContent)
  api.GET("/config", api.GetConfig)
  api.GET("/config/exec", api.GetConfigExec)
  api.GET("/config/mapping", api.GetConfigMapping)
  api.GET("/config/sound", api.GetConfigSound)

  srv.FS("/", http.FileServer(config.GetAppFS()))
  srv.FS("/common/", http.StripPrefix("/common/", http.FileServer(config.GetCommonFS())))
  srv.FS("/content/", http.StripPrefix("/content/", http.FileServer(config.GetContentFS())))

  srv.ListenAndServe()
  core.Run()

  stop := make(chan os.Signal, 1)
  signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
  <-stop

  // srv.Shutdown()
}