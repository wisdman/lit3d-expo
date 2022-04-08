package chromium

import (
	"fmt"
	"path/filepath"
)

const (
  profile = "lit3d-expo"

  chromiumPath        = "./chromium"
  chromiumBinaryPath  = chromiumPath + "/chrome.exe"
  chromiumDataPath    = "./chromium-data"
  chromiumProfilePath = "./chromium-data" + profile
)

type Chromium struct {
	path        string
	binaryPath  string
	dataPath    string
	profile		  string
	profilePath string 
}

func New(baseDir string) (*Chromium, error) {
	absPath, err := filepath.Abs(filepath.Join(baseDir, chromiumPath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect path: %+v\n", err)
  }

  absBinaryPath, err := filepath.Abs(filepath.Join(baseDir, chromiumBinaryPath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect binary path: %+v\n", err)
  }

  absDataPath, err := filepath.Abs(filepath.Join(baseDir, chromiumDataPath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect data path: %+v\n", err)
  }

  absProfilePath, err := filepath.Abs(filepath.Join(baseDir, chromiumProfilePath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect profile path: %+v\n", err)
  }

	c := &Chromium{
		profile: profile,

		path: absPath,
		binaryPath: absBinaryPath,
		dataPath: absDataPath,
		profilePath: absProfilePath,
	}

	return c, nil
}
