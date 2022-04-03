package api

import (
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"

	"github.com/wisdman/lit3d-expo/packages/shell/core"
)


func (api *API) GetID(w http.ResponseWriter, r *http.Request) {
	service.ResponseText(w, core.ID)
}

func (api *API) SetID(w http.ResponseWriter, r *http.Request) {
	
}