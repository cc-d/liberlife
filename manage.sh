#!/bin/sh

ROOT_DIR=`dirname $(realpath $0)`
FRONT_DIR="$ROOT_DIR/frontend"
API_DIR="$ROOT_DIR/api"

NGINX_DIR="$ROOT_DIR/nginx"
HTML_DIR="$NGINX_DIR/html"

if [ -z "$LIBLIFE_ENV" ]; then
    LIBLIFE_ENV="dev"
fi


for l in $(cat "$API_DIR/envs/$LIBLIFE_ENV.env" | grep -vE "^$"); do
    export $l;
done



uvistart() {
    if [ -d "$API_DIR/venv" ]; then
        . "$API_DIR/venv/bin/activate"
    fi

    uvicorn api.app.main:app --port $API_PORT --host $API_HOST --reload
}

for l in $(cat "$FRONT_DIR/envs/$LIBLIFE_ENV.env" | grep -vE "^$"); do
    export $l;
done

export dcexec-front() {
    echo "$dcexec cmd: $@"
    shift
    docker compose exec -it frontend /bin/bash "$@"
}

API_BASE="http://$API_HOST:$API_PORT"
OPEN_API_URL="$API_BASE/openapi.json"

build_types() {
    echo "Generating types from: $OPEN_API_URL"

    dcexec-front $npx openapi-typescript-codegen generate \
        --exportSchemas true \
        --input "$OPEN_API_URL" \
        --output "$ROOT_DIR/frontend/src/api/"



}


build_frontend() {
    # NVM init
    build_types

    dcexec-front npm ci --omit=dev

    echo "$(date)" > "$FRONT_DIR/build.txt"
    echo "$(git rev-parse HEAD)" >> "$FRONT_DIR/build.txt"

    PROD_API_URL="https://life.liberfy.ai/api"

    if [ "$REACT_APP_API_BASEURL" = $PROD_API_URL ]; then
        sed -i.bak "s|$$API_BASE|$PROD_API_URL|g" "$ROOT_DIR/nginx/html/static/js/*.js"
    fi

}

while [ $# -gt 0 ]; do
    case $1 in
        build_frontend)
            build_frontend
            shift
            ;;
        build_types)
            build_types
            shift
            ;;
      *)
        echo "Invalid option: $1" >&2
        exit 1
        ;;

    esac
done