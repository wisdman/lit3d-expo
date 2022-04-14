package api

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/wisdman/lit3d-expo/libs/service"
)

var graphicExt = []string{"mp4", "webm", "mkv", "png", "webp", "avif", "jpg", "jpeg"}
func isPathGraphic(path string) bool {
  ext := strings.TrimPrefix(filepath.Ext(path), ".")
  for _, v := range graphicExt {
    if v == ext {
        return true
    }
  }
  return false
}

var soundExt = []string{"mp3", "wav", "ogg"}
func isPathSound(path string) bool {
  ext := strings.TrimPrefix(filepath.Ext(path), ".")
  for _, v := range soundExt {
    if v == ext {
        return true
    }
  }
  return false
}

func (api *API) GetContentGraphic(w http.ResponseWriter, r *http.Request) {
	constentPath := api.Config.ContentPath
	list := []string{}
	err := filepath.Walk(constentPath, func(path string, _ os.FileInfo, err error) error {
    if err != nil {
      return err
    }
    if isPathGraphic(path) {
      list = append(list, "/" + strings.TrimPrefix(path, constentPath))
    }
    return nil
  })
  if err != nil {
    service.Fatal(w, err)
		return
  }
  service.ResponseJSON(w, list)
}

func (api *API) GetContentSound(w http.ResponseWriter, r *http.Request) {
  constentPath := api.Config.ContentPath
  list := []string{}
  err := filepath.Walk(constentPath, func(path string, _ os.FileInfo, err error) error {
    if err != nil {
      return err
    }
    if isPathSound(path) {
      list = append(list, "/" + strings.TrimPrefix(path, constentPath))
    }
    return nil
  })
  if err != nil {
    service.Fatal(w, err)
    return
  }
  service.ResponseJSON(w, list)
}
