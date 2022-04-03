package common

import (
	"embed"
	"io/fs"
)

//go:embed app/*
var commonEmbedFS embed.FS
var APP, _ = fs.Sub(commonEmbedFS, "app")
