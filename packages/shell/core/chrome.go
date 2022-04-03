package core

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

const (
  chromiumPath = "./chromium"
  chromiumExecPath = chromiumPath + "/chrome.exe"
  chromiumDataPath = "./chromium-data"
)

var ChromeDataPath string
var ChromeExecPath string

func init() {
	chromiumDataPathAbs, err := filepath.Abs(chromiumDataPath)
  if err != nil {
    log.Fatalf("Incorrect Chrome data path: %+v\n", err)
  }
  ChromeDataPath = chromiumDataPathAbs

  chromiumExecPathAbs, err := filepath.Abs(chromiumExecPath)
  if err != nil {
    log.Fatalf("Incorrect Chrome exec path: %+v\n", err)
  }
  ChromeExecPath = chromiumExecPathAbs
}

func ClearChromeDataPath() {
	log.Printf("Clear Chrome data directory: %s", ChromeDataPath)

	err := os.RemoveAll(ChromeDataPath)
  if err != nil {
  	log.Printf("Clear Chrome data directory error: %+v\n", err)
  }

  err = os.MkdirAll(ChromeDataPath, 0666)
  if err != nil {
  	log.Printf("Make Chrome data directory error: %+v\n", err)
  }
}

func Chrome(url string, num uint8, x, y int16) {
	dataPath, err := filepath.Abs(filepath.Join(ChromeDataPath, fmt.Sprintf("/%d", num)))
	if err != nil {
		log.Fatalf("Incorrect Chrome data path: %v\n", err)
	}

	cmd := exec.Command(
		ChromeExecPath,
		fmt.Sprintf("--user-data-dir=%s", dataPath),
		"--profile-directory=Default",
		fmt.Sprintf("--window-position=%d,%d", x, y),
		"--kiosk",
		url,
	)

	if err := cmd.Start(); err != nil {
		log.Printf("Chrome Start error: %+v\n", err)
		return
	}

	log.Printf("Chrome started with url %+s\n", url)
}