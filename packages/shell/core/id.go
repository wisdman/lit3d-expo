package core

import (
  "log"
  "os"
)

var ID string

func init() {
  hostname, err := os.Hostname()
  if err != nil {
    log.Fatalf("OS Hostname error: %+v\n", err)
  }
  ID = hostname
}
