package api

import (
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) GetConfig(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Core.GetConfig())
}

func (api *API) GetConfigExec(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Core.GetConfigExec())
}

func (api *API) GetConfigMapping(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Core.GetConfigMapping())
}

func (api *API) GetConfigSound(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Core.GetConfigSound())
}

func (api *API) SetConfig(w http.ResponseWriter, r *http.Request) {
	
}