package core

import (
	"log"
	"path/filepath"

	"github.com/wisdman/lit3d-expo/libs/common"

  "github.com/wisdman/lit3d-expo/packages/shell/chromium"
)

const (
  defaultTheme  = "main"
  themeFileName = "theme.txt"
)

type Core struct {
  id string

  contentPath       string
  contentThemePath  string
  contentConfigPath string 

  theme   string
  content *common.Content

  chromium *chromium.Chromium
}

func New(id string, contentPath string) *Core {
  absContentPath, err := filepath.Abs(contentPath)
  if err != nil {
    log.Fatalf("Core [New]: Incorrect content path: %+v\n", err)
  }

  absCcontentThemePath, err := filepath.Abs(filepath.Join(absContentPath, themeFileName))
  if err != nil {
    log.Fatalf("Core [New]: Incorrect content theme file path: %+v\n", err)
  }

  absContentConfigPath, err := filepath.Abs(filepath.Join(absContentPath, defaultTheme + ".json"))
  if err != nil {
    log.Fatalf("Core [New]: Incorrect content config file path: %+v\n", err)
  }

  core := &Core{
    id: id,
    
    contentPath: absContentPath,
    contentThemePath: absCcontentThemePath,
    contentConfigPath: absContentConfigPath,

    theme: defaultTheme,
    content: &common.Content{},

    chromium: chromium.New(),
  }

  core.ReadTheme()
  core.ReadContentConfig()

  return core
}

func (c *Core) Print() {
  log.Printf("[Core] Content path: %s\n", c.contentPath)
  log.Printf("[Core] Content theme file path: %s\n", c.contentThemePath)
  log.Printf("[Core] Content config file path: %s\n", c.contentConfigPath)
  log.Printf("[Core] Theme: %s\n", c.theme)
  c.chromium.Print()
}
