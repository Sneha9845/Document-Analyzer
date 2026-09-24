FROM node:20-bookworm-slim

WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json ./
RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 3000
ENV PORT=3000
CMD ["pnpm", "run", "dev"]
