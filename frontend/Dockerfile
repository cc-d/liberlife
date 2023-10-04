FROM node:20
WORKDIR /frontend
COPY ./package*.json ./
RUN npm install --loglevel verbose
COPY . /frontend
CMD ["npm", "start"]
