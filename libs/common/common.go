package common

import (
	"embed"
	"io/fs"
)

//go:embed app/*
var commonEmbedFS embed.FS
var FS, _ = fs.Sub(commonEmbedFS, "app")
