FROM node:16-slim

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./dist /app/

ENV NODE_ENV production

RUN npm ci --omit=dev

CMD ["node", "/app/server/server/index.js"]