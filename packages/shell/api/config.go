package api

import (
	"log"
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/common"
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

func (api *API) GetConfigMappingByID(w http.ResponseWriter, r *http.Request) {
	id := service.GetParam(r, "id")
	service.ResponseJSON(w, api.Core.GetConfigMappingByID(id))
}

func (api *API) SetConfigMappingByID(w http.ResponseWriter, r *http.Request) {
	id := service.GetParam(r, "id")
	var item = &common.Mapping{}
	if err := service.JSONBody(r, item); err != nil {
		log.Printf("API [SetConfigMappingByID] error: %+v\n", err)
		service.Error(w, http.StatusBadRequest)
		return
	}

	if item.Id != id {
		log.Printf("API [SetConfigMappingByID] error: Item id \"%s\" not equal request id \"%s\"\n", item.Id, id)
		service.Error(w, http.StatusBadRequest)
		return
	}

	if err := api.Core.SetConfigMappingByID(item); err != nil {
		log.Printf("API [SetConfigMappingByID] error: %+v\n", err)
		service.Error(w, http.StatusBadRequest)
		return
	}

	service.ResponseJSON(w, item)
}

func (api *API) GetConfigSound(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Core.GetConfigSound())
}

func (api *API) SetConfig(w http.ResponseWriter, r *http.Request) {
	
}