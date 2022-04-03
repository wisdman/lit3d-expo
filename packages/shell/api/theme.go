package api

import (
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) GetTheme(w http.ResponseWriter, r *http.Request) {
	service.ResponseText(w, api.Core.GetTheme())
}

func (api *API) SetThem(w http.ResponseWriter, r *http.Request) {
	
}
