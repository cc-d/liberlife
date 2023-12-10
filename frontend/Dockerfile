FROM node:20
COPY . ./frontend
WORKDIR /frontend
RUN npm install --loglevel verbose
RUN npm run build

EXPOSE 3999