FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm audit fix --force
RUN npm fund

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]