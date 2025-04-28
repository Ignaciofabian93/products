FROM node:23-slim

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm run build

RUN npx prisma generate

COPY . .

EXPOSE 4002

CMD [ "npm", "start" ]