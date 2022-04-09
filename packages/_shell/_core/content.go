package core

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/wisdman/lit3d-expo/libs/config"
)

const (
  contentPath   = "./content"
  defaultTheme  = "main"
  themeFileName = "theme.txt"
)

var ContentPath string
var ThemeFilePath string

var mediaExt = []string{"mp4", "webm", "mkv", "png", "webp", "avif", "jpg", "jpeg"}

func init() {
  contentPathAbs, err := filepath.Abs(contentPath)
  if err != nil {
    log.Fatalf("Incorrect content path: %+v\n", err)
  }
  ContentPath = contentPathAbs

  contentThemeFileAbs, err := filepath.Abs(filepath.Join(ContentPath, themeFileName))
  if err != nil {
    log.Fatalf("Incorrect content theme file path: %+v\n", err)
  }
  ThemeFilePath = contentThemeFileAbs
}

func GetContentTheme() string {
  file, err := os.OpenFile(ThemeFilePath, os.O_RDONLY, 0644)
  if err != nil {
    log.Printf("Content theme file open error: %+v\n", err)
    return defaultTheme
  }
  defer file.Close()

  var theme string
  scanner := bufio.NewScanner(file)
  if scanner.Scan() == true {
    theme = scanner.Text()
  }

  if err := scanner.Err(); err != nil {
    log.Printf("Content theme file scan error: %+v\n", err)
    return defaultTheme
  }

  theme = strings.TrimSpace(theme)
  if theme == "" {
    log.Printf("Incorrect content theme name: %s\n", theme)
    return defaultTheme
  }

  return theme
}

func SetContentTheme(theme string) error {
  theme = strings.TrimSpace(theme)
  if theme == "" {
    log.Printf("Incorrect content theme name: %s\n", theme)
    return fmt.Errorf("Incorrect content theme name: %s\n", theme)
  }

  file, err := os.OpenFile(ThemeFilePath, os.O_WRONLY|os.O_CREATE, 0644)
  if err != nil {
    log.Printf("Content theme file open error: %+v\n", err)
    return err
  }
  defer file.Close()

  writer := bufio.NewWriter(file)
  _, err = writer.WriteString(theme)
  if err != nil {
    log.Printf("Content theme file write error: %+v\n", err)
    return err
  }
  
  return nil
}

func GetContentConfig() *config.Content {
  configFile := GetContentTheme() + ".json"
  configAbs, err := filepath.Abs(filepath.Join(ContentPath, configFile))
  if err != nil {
    log.Fatalf("Incorrect content config file path: %+v\n", err)
  }
  
  file, err := os.OpenFile(configAbs, os.O_RDONLY, 0644)
  if err != nil {
    log.Printf("Incorrect config file: %+v\n", err)
    return &config.Content{}
  }
  defer file.Close()

  var contentConfig *config.Content
  jsonParser := json.NewDecoder(file)
  if err = jsonParser.Decode(&contentConfig); err != nil {
    log.Printf("Incorrect config parse: %+v\n", err)
    return &config.Content{}
  }

  return contentConfig
}

func SetContentConfig(config *config.Content) error {
  configFile := GetContentTheme() + ".json"
  configAbs, err := filepath.Abs(filepath.Join(ContentPath, configFile))
  if err != nil {
    log.Fatalf("Incorrect content config file path: %+v\n", err)
  }

  file, err := os.OpenFile(configAbs, os.O_WRONLY|os.O_CREATE, 0644)
  if err != nil {
    log.Printf("Incorrect config file: %+v\n", err)
    return fmt.Errorf("Incorrect config file: %+v\n", err)
  }
  defer file.Close()

  err = json.NewEncoder(file).Encode(config)
  if err != nil {
    return fmt.Errorf("Incorrect config write: %+v\n", err)
  }
  return nil
} 

func isPathMedia(path string) bool {
  ext := strings.TrimPrefix(filepath.Ext(path), ".")
  for _, v := range mediaExt {
    if v == ext {
        return true
    }
  }
  return false
}

func ListContent() ([]string, error) {
  list := []string{}
  err := filepath.Walk(ContentPath, func(path string, _ os.FileInfo, err error) error {
    if err != nil {
      return err
    }
    if isPathMedia(path) {
      list = append(list, "/content" + strings.TrimPrefix(path, ContentPath))
    }
    return nil
  })
  if err != nil {
    return nil, err
  }
  return list, nil
}
