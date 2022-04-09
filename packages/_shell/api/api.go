package api

import (
	"github.com/wisdman/lit3d-expo/libs/service"

	"github.com/wisdman/lit3d-expo/packages/shell/core"
)

type API struct{
	*service.API
	Core *core.Core
}