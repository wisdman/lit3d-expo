package api

import (
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"

	"github.com/wisdman/lit3d-expo/packages/shell/core"
)


func (api *API) GetConfig(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, core.GetContentConfig())
}

func (api *API) SetConfig(w http.ResponseWriter, r *http.Request) {
	
}