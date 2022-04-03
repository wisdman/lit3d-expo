package api

import (
	"net/http"

	"github.com/wisdman/lit3d-expo/libs/service"
)

func (api *API) GetID(w http.ResponseWriter, r *http.Request) {
	service.ResponseText(w, api.Core.GetID())
}
