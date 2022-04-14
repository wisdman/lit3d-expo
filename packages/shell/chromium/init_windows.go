//go:build windows

package chromium

import (
	// "fmt"
	"log"
	"time"
)

const (
  waitMainWindowTimeout = time.Second * 30
  waitCloseWindowTimeout = time.Second * 30
)

func (c *Chromium) Init() error {
  log.Printf("Chromium [Init] Chrome initialization...\n")

  if err := c.Kill(); err != nil {
    return err
  }

  // if err := c.Clear(); err != nil {
  //   return err
  // }
  
  // if err := c.Extract(); err != nil {
  //   return err
  // }

  // errChan := make(chan error, 1)
  // successChan := make(chan bool, 1)
  // go func() {
  //   err := c.Run(defaultUrl, false)
  //   if (err != nil) {
  //     errChan <- err
  //   } else {
  //     successChan <- true
  //   }
  // }()

  
  // win, err := c.WaitMainWindow(waitMainWindowTimeout)
  // if (err != nil) {
  //   return err
  // }

  // win.Close()
  
  // select {
  // case err := <-errChan:
  //   return err
  // case <- time.After(waitCloseWindowTimeout):
  //   return fmt.Errorf("Chromium [Init] Close window timeout error")
  // case <- successChan:
  // }

  // cfg, err := c.ReadUserConfig()
  // if (err != nil) {
  //   return err
  // }

  // fmt.Println(cfg)

  // log.Printf("Chromium [Init] Chrome initialization successful\n")
  return nil
}
