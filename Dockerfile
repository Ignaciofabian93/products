FROM node:23-slim

WORKDIR /app

COPY package.json .

COPY tsconfig.json .

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 4002

CMD [ "npm", "start" ]