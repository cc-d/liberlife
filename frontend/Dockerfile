FROM node:20
WORKDIR /frontend
COPY package*.json ./
RUN npm install --loglevel verbose
COPY . ./

EXPOSE 3999