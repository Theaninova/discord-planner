FROM node:16-alpine

USER root
RUN apk add --update python3 py3-pip make g++

USER node
ADD --chown=node:node . /app
WORKDIR /app
RUN npm ci && npm run build

CMD ["node", "./build/app.js"]
