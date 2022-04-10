package api

import (
	"github.com/wisdman/lit3d-expo/libs/service"

	"github.com/wisdman/lit3d-expo/packages/shell/chromium"
	"github.com/wisdman/lit3d-expo/packages/shell/config"
)

type API struct{
	*service.API
	Chrome *chromium.Chromium
	Config *config.Config
}