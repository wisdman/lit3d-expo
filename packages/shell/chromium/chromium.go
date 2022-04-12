package chromium

import (
	"fmt"
	"os"
	"path/filepath"
)

const (
  profile    = "lit3d-expo"
  defaultUrl = "https://localhost"

  chromiumPath        = "./chromium"
  chromiumBinaryPath  = chromiumPath + "/" + chromiumBinary
  chromiumDataPath    = "./chromium-data"
  chromiumProfilePath = chromiumDataPath + "/" + profile
)

type Chromium struct {
  path        string
  baseUrl     string
  binary      string
  binaryPath  string
  dataPath    string
  profile     string
  profilePath string 
}

func New(baseDir string) (*Chromium, error) {
  if baseDir == "" {
    baseDir = os.TempDir()
  }

  absPath, err := filepath.Abs(filepath.Join(baseDir, chromiumPath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect path: %w", err)
  }

  absBinaryPath, err := filepath.Abs(filepath.Join(baseDir, chromiumBinaryPath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect binary path: %w", err)
  }

  absDataPath, err := filepath.Abs(filepath.Join(baseDir, chromiumDataPath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect data path: %w", err)
  }

  absProfilePath, err := filepath.Abs(filepath.Join(baseDir, chromiumProfilePath))
  if err != nil {
    return nil, fmt.Errorf("Chromium [New] Incorrect profile path: %w", err)
  }

  c := &Chromium{
    profile: profile,
    path: absPath,
    binary: chromiumBinary,
    binaryPath: absBinaryPath,
    dataPath: absDataPath,
    profilePath: absProfilePath,
  }

  return c, nil
}
