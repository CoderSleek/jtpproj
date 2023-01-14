FROM node:16.14-alpine

WORKDIR /app

RUN npm install -g create-react-app

COPY package*.json ./

RUN npm install

COPY . ./

ENV port=3000

EXPOSE 3000

CMD ["npm", "start"]