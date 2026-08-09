FROM oven/bun:1.3.14-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.3.14-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    DATABASE_PATH=/data/easy-order.sqlite \
    HOST=0.0.0.0 \
    PORT=3000

# The app has no runtime dependencies — adapter-node bundles everything,
# and SQLite comes from Bun itself. Only the build output is needed.
COPY --from=build /app/build ./build

RUN mkdir -p /data && chown -R bun:bun /data /app
USER bun

VOLUME ["/data"]
EXPOSE 3000

# Schema migrations run on server start (see src/hooks.server.ts).
CMD ["bun", "./build/index.js"]
