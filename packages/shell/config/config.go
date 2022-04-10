package config

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
)

var (
  hostname, _ = os.Hostname()
)

type Config struct { 
  filePath    string
  appFS       fs.FS
  commonFS    fs.FS

  Master      string `json:"master"`
  ID         *string `json:"id,omitempty"`

  Port        uint32 `json:"port,omitempty"`
  SSLCert     string `json:"cert"`
  SSLKey      string `json:"key"`

  AppPath    *string `json:"app,omitempty"`
  CommonPath *string `json:"common,omitempty"`
  ContentPath string `json:"content"`

  Theme       string `json:"theme"`
  
  Content     Content `json:"-"`
}

func New(configFilePath string) *Config {
  return &Config{
    filePath:    configFilePath,     
    Master:      "lit3d.expo.local",
    Port:        443,
    SSLCert:     "./ssl/server.crt",
    SSLKey:      "./ssl/server.key",
    ContentPath: "./content",
    Theme:       "main",
    Content:     Content{},
  }
}

func (c *Config) GetID() string {
  if c.ID != nil {
    return *c.ID
  }
  return hostname
}

func (c *Config) Print() {
  log.Printf("Config -> Client ID: %s\n", c.GetID())
  log.Printf("Config -> Master host: %s\n", c.Master)

  if (c.AppPath == nil) {
    log.Printf("Config -> AppPath path: embedded\n")
  } else {
    log.Printf("Config -> AppPath path: %s\n", *c.AppPath)
  }

  if (c.CommonPath == nil) {
    log.Printf("Config -> CommonPath path: embedded\n")
  } else {
    log.Printf("Config -> CommonPath path: %s\n", *c.CommonPath)
  }

  log.Printf("Config -> Content path: %s\n", c.ContentPath)
  log.Printf("Config -> Content theme: %s\n", c.Theme)
  log.Printf("Config -> Content ID: %s\n", c.Content.Id)
}

func (c *Config) Patch(configStr string) error {
  if (configStr == "") {
    return nil
  }
  
  err := json.Unmarshal([]byte(configStr), c)
  if err != nil {
    return fmt.Errorf("Config [Patch] JSON error: %w", err)
  }
  
  return nil
} 

func (c *Config) Read() error {
  file, err := os.OpenFile(c.filePath, os.O_RDONLY, 0644)
  if err != nil {
    return fmt.Errorf("Config [Read] File error: %w", err)
  }
  defer file.Close()
  
  jsonParser := json.NewDecoder(file)
  if err = jsonParser.Decode(c); err != nil {
    return fmt.Errorf("Config [Read] JSON error: %w", err)
  }

  return nil
}

func (c *Config) Write() error {
  file, err := os.OpenFile(c.filePath, os.O_WRONLY|os.O_CREATE, 0644)
  if err != nil {
    return fmt.Errorf("Config [Write] File error: %w", err)
  }
  defer file.Close()

  enc := json.NewEncoder(file)
  enc.SetIndent("", "  ")
  if err := enc.Encode(c); err != nil {
    return fmt.Errorf("Config [Write] JSON error: %w", err)
  }
  return nil
}

func (c *Config) ReadContent() error {
  configPath := filepath.Join(c.ContentPath, c.Theme + ".json")
  file, err := os.OpenFile(configPath, os.O_RDONLY, 0644)
  if err != nil {
    return fmt.Errorf("Config [ReadContent] File error: %w", err)
  }
  defer file.Close()

  var contentConfig Content
  jsonParser := json.NewDecoder(file)
  if err = jsonParser.Decode(&contentConfig); err != nil {
    return fmt.Errorf("Config [ReadContent] JSON error: %w", err)
  }

  c.Content = contentConfig
  return nil
}

func (c *Config) WriteContent() error {
  configPath := filepath.Join(c.ContentPath, c.Theme + ".json")
  file, err := os.OpenFile(configPath, os.O_WRONLY|os.O_CREATE, 0644)
  if err != nil {
    return fmt.Errorf("Config [WriteContent] File error: %w", err)
  }
  defer file.Close()
  
  enc := json.NewEncoder(file)
  enc.SetIndent("", "  ")
  if err := enc.Encode(c.Content); err != nil {
    return fmt.Errorf("Config [WriteContent] JSON error: %w", err)
  }
  return nil
}