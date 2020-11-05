FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --prod
COPY . .

CMD ["npm", "start"]