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


build_types() {

    API_BASE="http://localhost:$API_PORT"
    OPEN_API_URL="$API_BASE/openapi.json"
    echo "Generating types from: $OPEN_API_URL"

    npx openapi-typescript-codegen generate \
        --exportSchemas true \
        --input "$OPEN_API_URL" \
        --output "$ROOT_DIR/frontend/src/api/"
}


build_frontend() {
    # NVM init
    if [ -d "$HOME/.nvm" ]; then
        export NVM_DIR="$HOME/nvm.sh";
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    else
        echo "nvm/node 20 is required to build the frontend without docker"
    fi

    nvm use 20;

    npm ci --omit=dev

    echo "$(date)" > "$FRONT_DIR/build.txt"
    echo "$(git rev-parse HEAD)" >> "$FRONT_DIR/build.txt"

    if [ "$REACT_APP_API_BASEURL" = "https://life.liberfy.ai/api" ]; then
        FIX_URLS="$BASE"
        REP_URLS="https://life.liberfy.ai/api"
        sed -i.bak "s|$FIX_URLS|$REP_URLS|g" "$ROOT_DIR/nginx/html/static/js/*.js"
    fi

}

while [ $# -gt 0 ]; do
    case $1 in
        build_types)
            shift
            build_types
            ;;
        build_types)
            shift
            build_types
            ;;
      *)
        echo "Invalid option: $1" >&2
        exit 1
        ;;

    esac
done