FROM node:20

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "start"]

