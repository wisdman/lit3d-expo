#!/bin/sh

ENV_DIR="$(dirname "$( cd "$(dirname "$0")" ; pwd -P )")"
PGDATABASE=lit3d-expo

case "$1" in
  admin)
    eval 'go run -mod=vendor ./packages/admin -cert="./ssl/server.crt" -key="./ssl/server.key" -app="./packages/admin/app" -common="./libs/common"'
    ;;
  server)
    eval 'go run -mod=vendor ./packages/server -cert="./ssl/server.crt" -key="./ssl/server.key"'
    ;;
  shell)
    eval 'go run -mod=vendor ./packages/shell -cfg="{ \"app\":\"./packages/shell/app\", \"common\":\"./libs/common/app\" }" -d ${@:2}'
    ;;
  *)
    echo "Error first argument" >&2
    exit 1
    ;;
esac