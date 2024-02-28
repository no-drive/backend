FROM node:latest

WORKDIR ../

RUN npm cache clean --force
COPY package*.json ./
RUN npm install

COPY . ./

CMD ["node", "index.js"]
