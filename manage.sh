ROOT_DIR=`dirname $(realpath $0)`
FRONT_DIR=`$ROOT_DIR/frontend`
API_DIR="$ROOT_DIR/api"

NGINX_DIR="$ROOT_DIR/nginx"
HTML_DIR="$NGINX_DIR/html"
PUBLIC_DIR=

if [ -z "$LIBLIFE_ENV" ]; then
    export LIBLIFE_ENV="dev"
fi

set -a
ENVFILE="$API_DIR/$LIBLIFE_ENV.env"
set +a

uvistart() {
    if [ -d "$API_DIR/venv" ]; then
        . "$API_DIR/venv/bin/activate"
    fi

    uvicorn api.app.main:app --port $API_PORT --host $API_HOST --reload
}

# fetch absolute repo root _DIR
FRONT_DIR="$(dirname $(realpath $0))/frontend"
set -a
. $FRONT_DIR
set +a

build_types() {

    echo "Generating types from: $OPENAPIURL"

    npx openapi-typescript-codegen generate \
        --exportSchemas true \
        --input "$OPENAPIURL" \
        --output "$ROOT_DIR/frontend/src/api/"

    echo "$(date)" > "$FRONT_DIR/build.txt"
    echo "$(git rev-parse HEAD)" >> "$FRONT_DIR/build.txt"
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

    BASE="http://$API_HOST:$API_PORT"
    OPENAPIURL="$BASE/openapi.json"

    npx openapi-typescript-codegen generate \
        --exportSchemas true \
        --input "$OPENAPIURL" \
        --output "$ROOT_DIR/frontend/src/api/"

    echo "$(date)" > "$FRONT_DIR/build.txt"
    echo "$(git rev-parse HEAD)" >> "$FRONT_DIR/build.txt"

    if [ "$REACT_APP_API_BASEURL" = "https://life.liberfy.ai/api" ]; then
        _FIXURLS="http://localhost:8999"
        _REPURLS="https://life.liberfy.ai/api"
        sed -i.bak "s|$_FIXURLS|$_REPURLS|g" "$ROOTDIR/nginx/html/static/js/*.js"
    fi

}

