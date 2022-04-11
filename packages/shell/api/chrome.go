package api

import (
	"fmt"
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) ChromeF11(w http.ResponseWriter, r *http.Request) {
	windowID := service.GetParam(r, "id")
	prefix := fmt.Sprintf("[%s]", windowID)
	
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