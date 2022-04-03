package main

import (
  "log"
  "os"
  "path/filepath"
  "strings"
)

func getHostname() string {
  hostname, err := os.Hostname()
  if err != nil {
    log.Fatalf("[] OS Hostname error: %+v\n", err)
  }
  return hostname
}

func getExecName() string {
  execName, err := os.Executable()
  if err != nil {
    log.Fatalf("OS Executable error: %+v\n", err)
  }
  return filepath.Base(execName)
}

func getLogFilePath() string {
  execName := getExecName()
  return filepath.Join(os.TempDir(), strings.TrimSuffix(execName, filepath.Ext(execName)) + ".log")
}

func getConfigFilePath() string {
  execName := getExecName()
  return "./" + strings.TrimSuffix(execName, filepath.Ext(execName)) + ".json"
}