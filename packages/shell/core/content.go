package core

import (
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/wisdman/lit3d-expo/libs/common"
)

func (c *Core) GetConfig() *common.Content {
	return c.content
}

func (c *Core) GetConfigMapping() *[]common.Mapping {
  if c.content.Mapping == nil {
    empty := make([]common.Mapping, 0)
    return &empty
  }

  return c.content.Mapping
}

func (c *Core) GetConfigExec() *[]common.Exec {
  if c.content.Exec == nil {
    empty := make([]common.Exec, 0)
    return &empty
  }

  return c.content.Exec
}

func (c *Core) GetConfigSound() *[]common.Sound {
  if c.content.Sound == nil {
    empty := make([]common.Sound, 0)
    return &empty
  }

  return c.content.Sound
}

func (c *Core) ReadContentConfig() *common.Content {
  file, err := os.OpenFile(c.contentConfigPath, os.O_RDONLY, 0644)
  if err != nil {
    log.Printf("Core [ReadContentConfig]: Content config file error: %+v\n", err)
    return c.content
  }
  defer file.Close()

  var contentConfig *common.Content
  jsonParser := json.NewDecoder(file)
  if err = jsonParser.Decode(&contentConfig); err != nil {
    log.Printf("Core [ReadContentConfig]: Config parse error: %+v\n", err)
    return c.content
  }

  c.content = contentConfig
  return c.content
}

func (c *Core) ListContent() ([]string, error) {
  list := []string{}
  err := filepath.Walk(c.contentPath, func(path string, _ os.FileInfo, err error) error {
    if err != nil {
      return err
    }
    if isPathMedia(path) {
      list = append(list, "/content" + strings.TrimPrefix(path, c.contentPath))
    }
    return nil
  })
  if err != nil {
    return nil, err
  }
  return list, nil
}

var mediaExt = []string{"mp4", "webm", "mkv", "png", "webp", "avif", "jpg", "jpeg"}
func isPathMedia(path string) bool {
  ext := strings.TrimPrefix(filepath.Ext(path), ".")
  for _, v := range mediaExt {
    if v == ext {
        return true
    }
  }
  return false
}