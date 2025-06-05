FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install 

COPY . . 

EXPOSE 3000

CMD ["sh", "-c", "yarn start --host 0.0.0.0"]
