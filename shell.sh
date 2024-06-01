#!/bin/sh
ROOTDIR="/home/cary/liberlife"
APIDIR="$ROOTDIR/api"

if [ -z "$LIBLIFE_ENV" ]; then
    export LIBLIFE_ENV="dev"
fi

for l in $(cat "$ROOTDIR/.envs/$LIBLIFE_ENV.env" | grep -v "^#" | grep -v "^$"); do
    echo "export $l"
    export $l
done


uvistart() {
    cd $ROOTDIR
    . "$APIDIR/venv/bin/activate"




    echo "$PATH"
    echo `env`


    uvicorn api.app.main:app --port $API_PORT --host $API_HOST --reload
}

gentypes() {
    BASE="http://$API_HOST:$API_PORT"
    OPENAPI_URL="$BASE/openapi.json"
    echo "Generating types from: $OPENAPI_URL"
    npx openapi-typescript-codegen generate \
        --exportSchemas true \
        --input "$OPENAPI_URL" \
        --output "$ROOTDIR/frontend/src/api/"
}

npmapi() {
    gentypes
    echo "Copying $LIBLIFE_ENV.env to $ROOTDIR/frontend/.env"
    cp "$ROOTDIR/.envs/$LIBLIFE_ENV.env" "$ROOTDIR/frontend/.env"
    echo "PORT=$REACT_APP_PORT" >> "$ROOTDIR/frontend/.env"
    echo "HOST=$REACT_APP_HOST" >> "$ROOTDIR/frontend/.env"
    cd $ROOTDIR/frontend && npm start && cd $ROOTDIR
}

automigrate() {
    cd $APIDIR
    alembic revision --autogenerate && alembic upgrade head
    cd -
}

alias psqldb="psql -U pguser -h 127.0.0.1 -p 5432 liblifedb"

if [ -d "$HOME/.pyenv" ]; then
    if command -v pyenv 1>/dev/null 2>&1; then
        eval "$(pyenv init -)"
    fi
fi

if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
    nvm use 20
fi

alias pytestargs='pytest tests -s -vv --show-capture=all -x --cov --cov-report=term-missing'

dateandcomhash() {
    echo "Attempting dateandcomhash with input: $0 $1 $2"
    [ -z "$1" ] && \
        echo "No file argument included. Usage: dateandcomhash /example/path" \
        && return 1
    _DANDC_COMHASH="$(git rev-parse HEAD)"
    echo "$(date)" > "$1"
    echo "$_DANDC_COMHASH" >> "$1"
    echo "Successfully dateandcomhash'd $1"
}

runbuild() {
    if ! nc -z localhost 8999; then
        echo "uvicorn not running"
        eval "uvistart" &
        pid=$!
        until nc -z localhost 8999; do
            echo "Waiting for uvicorn to start"
            sleep 1
        done
        wait $pid
    else
        echo "uvicorn already running"
    fi
    gentypes
    mv "$ROOTDIR/frontend/.env" "/tmp/.env.bak"
    eval '(cd $ROOTDIR/frontend && npm run build)'
    mv "/tmp/.env.bak" "$ROOTDIR/frontend/.env"
    rm -r "$ROOTDIR/nginx/html"
    sudo mv "$ROOTDIR/frontend/build" "$ROOTDIR/nginx/html"
    fixhtmlinjs
    dateandcomhash "$ROOTDIR/nginx/html/build.txt"
    cp "$ROOTDIR/nginx/html/build.txt" "$ROOTDIR/frontend/public/build.txt"
}

# i keep mixing these up
alias buildrun='runbuild'

fixhtmlinjs() {
    if [ "$REACT_APP_API_BASEURL" = "https://life.liberfy.ai/api" ]; then
        echo "Using prod URL"
        _FIXURLS="https://life.liberfy.ai/api"
        _REPURLS="http://localhost:8999"
    else
        echo "Using local URL"
        _FIXURLS="http://localhost:8999"
        _REPURLS="https://life.liberfy.ai/api"
    fi
    echo "Fixing URLs in JS files: $_FIXURLS -> $_REPURLS"
    sed -i.bak "s|$_FIXURLS|$_REPURLS|g" "$ROOTDIR/nginx/html/static/js/"*.js
    rm "$ROOTDIR/nginx/html/static/js/"*.bak
}

movetowww() {
    WWW_REPOHTML="$ROOTDIR/nginx/html"
    WWW_NGINXHTML="/var/www/html"
    if [ -d "$WWW_NGINXHTML" ]; then
        echo "nginx HTML exists at $WWW_NGINXHTML deleting"
        sudo rm -r "$WWW_NGINXHTML"
    fi
    echo "Resetting repo nginx/html to head"
    git reset "nginx/html"
    git checkout nginx/html
    sudo cp -r "$WWW_REPOHTML" "$WWW_NGINXHTML"
    sudo chmod -R 755 "$WWW_NGINXHTML/"
    sudo chown -R cary:cary "$WWW_NGINXHTML/"
    sudo systemctl restart nginx
}

# Execute the function passed as argument
$@
