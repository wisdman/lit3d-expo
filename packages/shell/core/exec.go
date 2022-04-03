package core

import "log"

func (c *Core) Run() {
	log.Printf("Core [Run]: Start slave process\n")
	c.chromium.Run("https://localhost")
}