package config

import (
	"github.com/wisdman/lit3d-expo/libs/common"
)

type Content struct {
	common.Content
}

func (c *Content) GetExec() *[]common.Exec {
  if c.Exec == nil {
    empty := make([]common.Exec, 0)
    return &empty
  }

  return &c.Exec
}

func (c *Content) GetKiosk() *[]common.Kiosk {
  if c.Kiosk == nil {
    empty := make([]common.Kiosk, 0)
    return &empty
  }

  return &c.Kiosk
}

func (c *Content) GetMapping() *[]common.Mapping {
  if c.Mapping == nil {
    empty := make([]common.Mapping, 0)
    return &empty
  }

  return &c.Mapping
}

func (c *Content) GetMappingByID(id string) *common.Mapping {
  for _, s := range c.Mapping {
    if (s.Id == id) {
      return &s
    }
  }
  
  return &common.Mapping{ Id: id }
}

func (c *Content) SetMappingByID(item *common.Mapping) {
  if len(c.Mapping) == 0 {
    c.Mapping = []common.Mapping{*item}
    return
  }

  for i, s := range c.Mapping {
    if (s.Id == item.Id) {
      c.Mapping[i] = *item
      return
    }
  }

  c.Mapping = append(c.Mapping, *item)
  return
}

func (c *Content) GetSound() *[]common.Sound {
  if c.Sound == nil {
    empty := make([]common.Sound, 0)
    return &empty
  }

  return &c.Sound
}