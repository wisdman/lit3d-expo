package chromium

import (
	"log"
	// "os"
	"path/filepath"
	"runtime"
)

const (
  profile = "lit3d-expo"

  chromiumPathDarwin = "/Applications/Google Chrome Beta.app/Contents/MacOS/"
  chromiumPathLinux = "./chromium"
  chromiumPathWindows = "C:\\Program Files\\Chromium"
  
  chromiumBinaryDarwin = "Google Chrome Beta"
  chromiumBinaryLinux = "chromium"
  chromiumBinaryWindows = "chrome.exe"

  chromiumDataDarwin = "./chromium-data"
  chromiumDataLinux = "./chromium-data"
  chromiumDataWindows = "C:\\Users\\User\\AppData\\Local\\Chromium\\User Data"
)

var chromiumPath string
var chromiumBinary string
var chromiumData string

func init() {
  switch os := runtime.GOOS; os {
    case "darwin":
    	chromiumPath = chromiumPathDarwin
      chromiumBinary = chromiumBinaryDarwin
    	chromiumData = chromiumDataDarwin
    case "linux":
    	chromiumPath = chromiumPathLinux
      chromiumBinary = chromiumBinaryLinux
    	chromiumData = chromiumDataLinux
    case "windows":
      chromiumPath = chromiumPathWindows
      chromiumBinary = chromiumBinaryWindows
    	chromiumData = chromiumDataWindows
    default:
      log.Fatalf("Chromium [init]: Incorrect runtime %s\n", os)
  }
}

type Chromium struct {
	path        string
	binaryPath  string
	dataPath    string
	profile		  string
	profilePath string 
}

func New() *Chromium {
	absPath, err := filepath.Abs(chromiumPath)
  if err != nil {
    log.Fatalf("Chromium [New]: Incorrect path: %+v\n", err)
  }

  absBinaryPath, err := filepath.Abs(filepath.Join(absPath, chromiumBinary))
  if err != nil {
    log.Fatalf("Chromium [New]: Incorrect binary path: %+v\n", err)
  }

  absDataPath, err := filepath.Abs(chromiumData)
  if err != nil {
    log.Fatalf("Chromium [New]: Incorrect data path: %+v\n", err)
  }

  absProfilePath, err := filepath.Abs(filepath.Join(absDataPath, profile))
  if err != nil {
    log.Fatalf("Chromium [New]: Incorrect data path: %+v\n", err)
  }

	chromium := &Chromium{
		path: absPath,
		binaryPath: absBinaryPath,
		dataPath: absDataPath,
		profile: profile,
		profilePath: absProfilePath,
	}

	return chromium
}

func (c *Chromium) Print() {
  log.Printf("[Chromium] Path: %s\n", c.path)
  log.Printf("[Chromium] Binary path: %s\n", c.binaryPath)
  log.Printf("[Chromium] Data path: %s\n", c.dataPath)
  log.Printf("[Chromium] Profile: %s\n", c.profile)
  log.Printf("[Chromium] Profile path: %s\n", c.profilePath)
}
