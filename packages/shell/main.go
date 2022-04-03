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
	"strings"
	"syscall"

	"github.com/wisdman/lit3d-expo/libs/common"
	"github.com/wisdman/lit3d-expo/libs/service"

	"github.com/wisdman/lit3d-expo/packages/shell/api"
	"github.com/wisdman/lit3d-expo/packages/shell/core"
)

const (
  defaultMaster  = "lit3d.expo.local"
  
  SSLCertPath = "./ssl/server.crt"
  SSLKeyPath  = "./ssl/server.key"
)

var revision = "unknown"

//go:embed app/*
var appEmbedFS embed.FS
var appFS, _ = fs.Sub(appEmbedFS, "app")

func main() {
	fmt.Printf("Lit3D-shell %s\n", revision)

  execName, err := os.Executable()
  if err != nil {
    log.Fatalf("OS Executable error: %+v\n", err)
  }
  execName = filepath.Base(execName)

  var appPath, commonPath string
  flag.StringVar(&appPath, "app", "", "App location path (default embedded)")
  flag.StringVar(&commonPath, "common", "", "Common location path (default embedded)")
  debug := flag.Bool("d", false, "Print log to stdout")
  flag.Usage = func() {
  	fmt.Fprintf(os.Stdout, "Usage of %s [OPTIONS] <Master host>:\n", execName)
		flag.PrintDefaults()
  }
  flag.Parse()
  
	if *debug != true {
  	logPath := "./" + strings.TrimSuffix(execName, filepath.Ext(execName)) + ".log"
  	logPath, err := filepath.Abs(logPath)
  	if err != nil {
    	log.Fatalf("Log file path error: %+v\n", err)
 	 	}

 	 	logFile, err := os.OpenFile(logPath, os.O_RDWR | os.O_CREATE | os.O_APPEND, 0666)
		if err != nil {
		  log.Fatalf("Opening log file error: %+v\n", err)
		}
		defer logFile.Close()
		log.SetOutput(logFile)
  }

  var appHFS http.FileSystem
  if (appPath != "") {
    appPathAbs, err := filepath.Abs(appPath)
    if err != nil {
      log.Fatalf("App location path error: %+v\n", err)
    }
    log.Printf("App location path: %s\n", appPathAbs)
    appHFS = http.Dir(appPathAbs)
  } else {
    appHFS = http.FS(appFS)
  }

  var commonHFS http.FileSystem
  if (commonPath != "") {
    commonPathAbs, err := filepath.Abs(commonPath)
    if err != nil {
      log.Fatalf("Common location path error: %+v\n", err)
    }
    log.Printf("Common location path: %s\n", commonPathAbs)
    commonHFS = http.Dir(commonPathAbs)
  } else {
    commonHFS = http.FS(common.FS)
  }

  masterHost := strings.TrimSpace(flag.Arg(0))
  if masterHost == "" {
    masterHost = defaultMaster
  }

	log.Printf("Client ID: %s\n", core.ID)
	log.Printf("Master host: %s\n", masterHost)
	log.Printf("Content path: %s\n", core.ContentPath)
	log.Printf("Theme file path: %s\n", core.ThemeFilePath)
	log.Printf("Theme: %s\n", core.GetContentTheme())

	srv := service.New(SSLCertPath, SSLKeyPath)

	api := &api.API{ srv.API("/api") }
	api.GET("/id", api.GetID)
	api.POST("/id", api.SetID)
	api.GET("/content", api.ListContent)
	api.GET("/config", api.GetConfig)
	api.POST("/config", api.SetConfig)

	srv.FS("/", http.FileServer(appHFS))
	srv.FS("/common/", http.StripPrefix("/common/", http.FileServer(commonHFS)))
	srv.FS("/content/", http.StripPrefix("/content/", http.FileServer(http.Dir(core.ContentPath))))

	srv.ListenAndServe()
	core.Run()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	srv.Shutdown()
}