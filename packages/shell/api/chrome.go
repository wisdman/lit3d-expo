package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) ChromeF11(w http.ResponseWriter, r *http.Request) {
	body := struct {
		WindowID string `json:"windowId"`
    Key      uint16 `json:"key"`
  }{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		service.Fatal(w, err)
		return
	}

	prefix := fmt.Sprintf("[%s]", body.WindowID)
	win, err := api.Chrome.FindWindowPrifix(prefix)
	if err != nil {
		service.Fatal(w, err)
		return
	}

	if win == nil {
		service.ResponseNoContent(w)
		return
	}

	win.F11()

	service.ResponseNoContent(w)
}