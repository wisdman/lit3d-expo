//go:build windows

package chromium

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/wisdman/lit3d-expo/packages/shell/winapi"
)

type Window struct {
	Title string
	HWND  winapi.HWND
	PID   uint32
}

func (w *Window) Visible() bool {
	return winapi.IsWindowVisible(w.HWND)
}

func (w *Window) Main() bool {
	return winapi.IsWindowMain(w.HWND)
}

func (w *Window) Close() {
	winapi.WindowCloseMessage(w.HWND)
}

func (w *Window) SendKeyPress(key uint16) {
	winapi.SendKeyPressInput(key)
}

func (w *Window) SetForeground() {
	winapi.SetForegroundWindow(w.HWND)
}

func (c *Chromium) GetWindows() (*[]Window, error) {
	processes, err := winapi.EnumProcesses()
	if err != nil {
		return nil, fmt.Errorf("Chromium [GetWindows] Win API error: %w", err) 
	}

	binary := strings.ToLower(c.binary)
	cPids := []uint32{}
	for _, p := range processes {
    if strings.ToLower(p.ExeFile()) == binary {
    	cPids = append(cPids, p.ProcessID)
    }
  }

  windows := []Window{}
  err = winapi.EnumWindows(
  	func(hWnd winapi.HWND, _ uintptr) bool {
  		pid := winapi.GetWindowThreadProcessId(hWnd)
  		if pidsSliceContains(&cPids, pid) {
  			windows = append(windows, Window{
  				Title: winapi.GetWindowText(hWnd),
  				HWND: hWnd,
  				PID: pid,
  			})
  		}
    	return true
    }, 
    0,
  )
  if err != nil {
     return nil, fmt.Errorf("Chromium [GetWindows] Win API error: %w", err) 
  }

	return &windows, nil
}

func (c *Chromium) WaitWindows(timeout time.Duration) (*[]Window, error) {
	var errChan = make(chan error, 1)
	var resultChan = make(chan *[]Window, 1)

	go func() {
		for {
	    select {
	    case <-time.After(timeout):
	    		errChan <- fmt.Errorf("Chromium [WaitWindows] Timeout error") 
	        return
	    default:
	      wins, err := c.GetWindows()
	      if err != nil {
	      	errChan <- err
	      	return
	      }
	      if len(*wins) > 0 {
	      	resultChan <- wins
	      	return
	      }
	    }
    }
	}()

	select {
	case err := <-errChan:
		return nil, err
	case result := <- resultChan:
		return result, nil
	}
}

func (c *Chromium) WaitMainWindow(timeout time.Duration) (*Window, error) {
	var errChan = make(chan error, 1)
	var resultChan = make(chan *Window, 1)

	go func() {
		for {
	    select {
	    case <-time.After(timeout):
	    		errChan <- fmt.Errorf("Chromium [WaitMainWindow] Timeout error") 
	        return
	    default:
	      wins, err := c.GetWindows()
	      if err != nil {
	      	errChan <- err
	      	return
	      }
	      if len(*wins) > 0 {
	      	for _, w := range *wins {
     				if w.Main() && w.Visible() {
     					resultChan <- &w
     					return
     				}
     			}
	      }
	    }
    }
	}()

	select {
	case err := <-errChan:
		return nil, err
	case result := <- resultChan:
		return result, nil
	}
}

func pidsSliceContains(s *[]uint32, e uint32) bool {
  for _, a := range *s {
    if a == e {
      return true
    }
  }
  return false
}