FROM strapi/base:12-alpine

WORKDIR /srv/app

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

ENV NODE_ENV=development

RUN yarn build

CMD ["yarn", "develop"]
