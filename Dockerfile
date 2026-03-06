FROM node:22.2-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y dumb-init && apt-get clean

COPY package.json tsconfig.json yarn.lock ./
RUN yarn install --ignore-scripts

COPY ./ ./
RUN yarn prisma:generate

ENV NODE_OPTIONS="--max-old-space-size=1024"
RUN yarn build

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]

CMD yarn prisma:migrate:deploy && yarn start
