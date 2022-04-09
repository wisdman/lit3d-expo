package api

import (
	"encoding/json"
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"
	"github.com/wisdman/lit3d-expo/packages/shell/screen"
)


func (api *API) MouseClick(w http.ResponseWriter, r *http.Request) {
	body := struct {
    X int32 `json:"x"`
    Y int32 `json:"y"`
  }{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		service.Fatal(w, err)
		return
	}

	screen.MouseClick(body.X, body.Y)
	service.ResponseNoContent(w)
}