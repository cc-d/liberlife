apt install curl git -y

export _REPONAME="$HOME/liberlife" #life.liberfy.ai"


if ! [ -d "$HOME/.pyenv" ]; then
    curl 'pyenv.run' | bash;
fi

export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"

eval "$(pyenv init --path)"
eval "$(pyenv init -)"
