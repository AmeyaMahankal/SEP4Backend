FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install && npm cache clean --force

COPY . /app/

EXPOSE 3000 23

CMD ["npm", "start"]