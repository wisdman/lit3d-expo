package core

import (
	"bufio"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func (c *Core) GetTheme() string {
  return c.theme
}

func (c *Core) ReadTheme() string {
  file, err := os.OpenFile(c.contentThemePath, os.O_RDONLY, 0644)
  if err != nil {
    log.Printf("Core [ReadTheme]: Theme file error: %+v\n", err)
    return c.theme
  }
  defer file.Close()

  var theme string
  scanner := bufio.NewScanner(file)
  if scanner.Scan() == true {
    theme = scanner.Text()
  }

  if err := scanner.Err(); err != nil {
    log.Printf("Core [ReadTheme]: Theme file scan error: %+v\n", err)
    return c.theme
  }

  theme = strings.TrimSpace(theme)
  if theme == "" {
    log.Printf("Core [ReadTheme]: Theme name is empty:")
    return c.theme
  }

  absContentConfigPath, err := filepath.Abs(filepath.Join(c.contentPath, theme + ".json"))
  if err != nil {
    log.Fatalf("Core [New]: Incorrect content config file path: %+v\n", err)
    return c.theme
  }

  c.theme = theme
  c.contentConfigPath = absContentConfigPath

  return c.theme
}
