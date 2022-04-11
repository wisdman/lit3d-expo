package main

import (
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"

	"github.com/wisdman/lit3d-expo/libs/common"
	"github.com/wisdman/lit3d-expo/libs/service"
	"github.com/wisdman/lit3d-expo/packages/shell/api"
	"github.com/wisdman/lit3d-expo/packages/shell/chromium"
	"github.com/wisdman/lit3d-expo/packages/shell/config"
)

var (
  revision       = "unknown"
  execName       = "lit3d-shell"
  tempDir        = os.TempDir()
  logFilePath    = filepath.Join(tempDir, execName + ".log")
  configFilePath = "./" + execName + ".json"
)

//go:embed app/*
var appEmbedFS embed.FS
var APP, _ = fs.Sub(appEmbedFS, "app")

func main() {
  fmt.Printf("%s %s\n", execName, revision)
  
  var configStr string
  flag.StringVar(&configStr, "cfg", "", "Custom config JSON")
  verbose := flag.Bool("v", false, "Print log to stdout")
  flag.Parse()

  if *verbose != true {
    logFile, err := os.OpenFile(logFilePath, os.O_RDWR | os.O_CREATE | os.O_APPEND, 0666)
    if err != nil {
      log.Fatalf("%+v\n", err)
    }
    defer logFile.Close()
    log.SetOutput(logFile)
  }

  cfg := config.New(configFilePath, configStr)
  cfg.Print()

  chrome, err := chromium.New(tempDir)
  if err != nil {
    log.Fatalf("%+v\n", err)
  }
  
  err = chrome.Init()
  if err != nil {
    log.Fatalf("%+v\n", err)
  }

  srv := service.New(cfg.Port, cfg.SSLCert, cfg.SSLKey)

  api := &api.API{ srv.API("/api"), chrome, cfg}
  api.GET("/id", api.GetID)
  api.POST("/chrome/f11/:id", api.ChromeF11)

  api.GET("/content", api.GetContent)

  api.GET("/config", api.GetConfig)
  api.GET("/config/content", api.GetConfigContent)
  api.GET("/config/content/exec", api.GetConfigContentExec)
  api.GET("/config/content/kiosk", api.GetConfigContentKiosk)
  api.GET("/config/content/mapping", api.GetConfigContentMapping)
  api.GET("/config/content/mapping/:id", api.GetConfigContentMappingByID)
  api.POST("/config/content/mapping/:id", api.SetConfigContentMappingByID)
  api.GET("/config/content/sound", api.GetConfigContentSound)
  api.GET("/config/theme", api.GetConfigTheme)

  var appFS http.FileSystem
  if cfg.AppPath != nil {
    appFS = http.Dir(*cfg.AppPath)
  } else {
    appFS = http.FS(APP)
  }
  srv.FS("/", http.FileServer(appFS))

  var commonFS http.FileSystem
  if cfg.CommonPath != nil {
    commonFS = http.Dir(*cfg.CommonPath)
  } else {
    commonFS = http.FS(common.APP)
  }
  srv.FS("/common/", http.StripPrefix("/common/", http.FileServer(commonFS)))
  
  srv.FS("/content/", http.StripPrefix("/content/", http.FileServer(http.Dir(cfg.ContentPath))))

  srv.ListenAndServe()

  chrome.Run("https://localhost/full-screen.html", false)

  stop := make(chan os.Signal, 1)
  signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
  <-stop
}
