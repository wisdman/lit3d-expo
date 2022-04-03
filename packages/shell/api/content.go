package api

import (
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"

	"github.com/wisdman/lit3d-expo/packages/shell/core"
)


func (api *API) ListContent(w http.ResponseWriter, r *http.Request) {
	list, err :=  core.ListContent()
	if err != nil {
		service.Fatal(w, err)
		return
	}
	service.ResponseJSON(w, list)
}
