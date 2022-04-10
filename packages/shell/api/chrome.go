package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) ChromeKeyPress(w http.ResponseWriter, r *http.Request) {
	body := struct {
		WindowID string `json:"windowId"`
    Key      uint16 `json:"key"`
  }{}
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		service.Fatal(w, err)
		return
	}

	wins, err := api.Chrome.GetWindows()
	if err != nil {
		service.Fatal(w, err)
		return
	}
	
	for _, w := range *wins {
		prefix := fmt.Sprintf("[%s]", body.WindowID)
		if strings.HasPrefix(w.Title, prefix) {
			w.SetForeground()
			w.SendKeyPress(body.Key)
		}
	}

	service.ResponseNoContent(w)
}