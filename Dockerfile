FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 4000

CMD ["npm", "run", "start", "--", "-p", "4000"]
