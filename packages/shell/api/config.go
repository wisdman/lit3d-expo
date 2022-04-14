package api

import (
	"log"
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/common"
	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) GetConfig(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Config)
}

func (api *API) GetConfigContent(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Config.Content)
}

func (api *API) GetConfigContentExec(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Config.Content.GetExec())
}

func (api *API) GetConfigContentKiosk(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Config.Content.GetKiosk())
}

func (api *API) GetConfigContentMapping(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Config.Content.GetMapping())
}

func (api *API) GetConfigContentMappingByID(w http.ResponseWriter, r *http.Request) {
	id := service.GetParam(r, "id")
	service.ResponseJSON(w, api.Config.Content.GetMappingByID(id))
}

func (api *API) SetConfigContentMappingByID(w http.ResponseWriter, r *http.Request) {
	id := service.GetParam(r, "id")
	var item = &common.Mapping{}
	if err := service.JSONBody(r, item); err != nil {
		log.Printf("API [SetConfigContentMappingByID] error: %+v\n", err)
		service.Error(w, http.StatusBadRequest)
		return
	}

	if item.Id != id {
		log.Printf("API [SetConfigContentMappingByID] error: Item id \"%s\" not equal request id \"%s\"\n", item.Id, id)
		service.Error(w, http.StatusBadRequest)
		return
	}

	api.Config.Content.SetMappingByID(item)
	
	if err := api.Config.WriteContent(); err != nil {
		log.Printf(" %+v\n", err)
		service.Error(w, http.StatusInternalServerError)
		return
	}

	service.ResponseJSON(w, item)
}

func (api *API) GetConfigContentSound(w http.ResponseWriter, r *http.Request) {
	service.ResponseJSON(w, api.Config.Content.GetSound())
}

func (api *API) SetConfigContentSound(w http.ResponseWriter, r *http.Request) {
	var sound = &[]common.Sound{}
	if err := service.JSONBody(r, sound); err != nil {
		log.Printf("API [GetConfigContentSound] error: %+v\n", err)
		service.Error(w, http.StatusBadRequest)
		return
	}

	api.Config.Content.Sound = *sound

	if err := api.Config.WriteContent(); err != nil {
		log.Printf(" %+v\n", err)
		service.Error(w, http.StatusInternalServerError)
		return
	}

	service.ResponseJSON(w, sound)
}


func (api *API) GetConfigTheme(w http.ResponseWriter, r *http.Request) {
	service.ResponseText(w, api.Config.Theme)
}

func (api *API) SetConfigThem(w http.ResponseWriter, r *http.Request) {
	
}