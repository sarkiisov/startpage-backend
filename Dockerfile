FROM node:23-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts=false --unsafe-perm --silent

# reference https://chengpeiquan.com/en/article/better-sqlite3-error-could-not-locate-the-bindings-file
RUN cd node_modules/sqlite3 && pnpm rebuild

COPY . .

RUN pnpm run build

CMD ["pnpm", "run", "start"]