package api

import (
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) ListContent(w http.ResponseWriter, r *http.Request) {
	list, err :=  api.Core.ListContent()
	if err != nil {
		service.Fatal(w, err)
		return
	}
	service.ResponseJSON(w, list)
}
