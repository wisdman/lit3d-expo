package main

import (
  "encoding/json"
  "fmt"
  "log"
  "net/http"
  "os"

  "github.com/wisdman/lit3d-expo/libs/common"
)

type Config struct { 
  Master      string  `json:"master"`
  ID          *string `json:"id,omitempty"`

  SSLCert     string  `json:"cert"`
  SSLKey      string  `json:"key"`

  AppPath     *string `json:"app,omitempty"`
  CommonPath  *string `json:"common,omitempty"`
  
  ContentPath string  `json:"content"`

  Port        *uint8  `json:"port,omitempty"`
}

func (c *Config) GetID() string {
  if c.ID != nil {
    return *c.ID
  }
  return getHostname()
}

func (c *Config) GetAppFS() http.FileSystem {
  if (c.AppPath == nil) {
    return http.FS(appFS)
  }

  return http.Dir(*c.AppPath) 
}

func (c *Config) GetCommonFS() http.FileSystem {
  if (c.CommonPath == nil) {
    return http.FS(common.APP)
  }

  return http.Dir(*c.CommonPath)  
}

func (c *Config) GetContentFS() http.FileSystem {
  return http.Dir(c.ContentPath)
}

func (c *Config) Write() error {
  configFile := getConfigFilePath()
  file, err := os.OpenFile(configFile, os.O_WRONLY|os.O_CREATE, 0644)
  if err != nil {
    return fmt.Errorf("Config [Write] error: %+v\n", err)
  }
  defer file.Close()

  err = json.NewEncoder(file).Encode(c)
  if err != nil {
    return fmt.Errorf("Config [Write] error: %+v\n", err)
  }
  return nil
}

func (c *Config) Read() {
  configFile := getConfigFilePath()
  file, err := os.OpenFile(configFile, os.O_RDONLY, 0644)
  if err != nil {
    log.Printf("Config [Read] error: %+v\n", err)
    return
  }
  defer file.Close()
  
  jsonParser := json.NewDecoder(file)
  if err = jsonParser.Decode(c); err != nil {
    log.Printf("Config [Read] error: %+v\n", err)
    return
  }

  return
}

func (c *Config) Patch(configStr string) {
  if (configStr == "") {
    return
  }
  
  err := json.Unmarshal([]byte(configStr), c)
  if err != nil {
    log.Printf("Config [Patch] error: %+v\n", err)
    return
  }
  
  return
} 

func (c *Config) Print() {
  log.Printf("[Config] Client ID: %s\n", c.GetID())
  log.Printf("[Config] Master host: %s\n", c.Master)

  if (c.AppPath == nil) {
    log.Printf("[Config] AppPath path: embedded\n")
  } else {
    log.Printf("[Config] AppPath path: %s\n", *c.AppPath)
  }

  if (c.CommonPath == nil) {
    log.Printf("[Config] CommonPath path: embedded\n")
  } else {
    log.Printf("[Config] CommonPath path: %s\n", *c.CommonPath)
  }

  log.Printf("[Config] Content path: %s\n", c.ContentPath)
}

func NewConfig(configStr string) *Config {

  config := &Config{
    Master:      "lit3d.expo.local",
    SSLCert:     "./ssl/server.crt",
    SSLKey:      "./ssl/server.key",
    ContentPath: "./content",
  }

   config.Read()
   config.Patch(configStr)
   
   return config
}
  