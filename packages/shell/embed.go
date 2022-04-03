package main

import (
  "embed"
  "io/fs"
)

//go:embed app/*
var appEmbedFS embed.FS
var appFS, _ = fs.Sub(appEmbedFS, "app")
