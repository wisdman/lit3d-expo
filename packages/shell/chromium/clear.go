package chromium

import (
  "fmt"
  "log"
  "os"
)

func (c *Chromium) ClearPath() error {
  log.Printf("Chromium [ClearPath] Clear directory \"%s\"\n", c.path)
  err := os.RemoveAll(c.path)
  if err != nil {
    return fmt.Errorf("Chromium [ClearPath] Clear directory error: %v\n", err)
  }
  err = os.MkdirAll(c.path, 0666)
  if err != nil {
    return fmt.Errorf("Chromium [ClearPath] Clear directory error: %v\n", err)
  }
  return nil
}

func (c *Chromium) ClearDataPath() error {
  log.Printf("Chromium [ClearDataPath] Clear directory \"%s\"\n", c.dataPath)
  err := os.RemoveAll(c.dataPath)
  if err != nil {
    return fmt.Errorf("Chromium [ClearDataPath] Clear directory error: %v\n", err)
  }
  err = os.MkdirAll(c.dataPath, 0666)
  if err != nil {
    return fmt.Errorf("Chromium [ClearDataPath] Clear directory error: %v\n", err)
  }
  return nil
}

func (c *Chromium) Clear() error {
  if err:= c.ClearPath(); err != nil {
    return err
  }
  if err:= c.ClearDataPath(); err != nil {
    return err
  }
  return nil
}
