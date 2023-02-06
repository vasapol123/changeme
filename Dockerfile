FROM node:19-alpine3.16

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

COPY ./apps/api/package.json apps/api/
COPY ./packages/** ./packages

RUN pnpm install

COPY ./ ./

RUN cd ./apps/api/ && npx prisma generate

EXPOSE 8080

CMD ["npx", "nx", "start:dev", "api"]
