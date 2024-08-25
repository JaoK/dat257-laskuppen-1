FROM node:16.20.2-alpine as build
WORKDIR /app
COPY client/package.json .
RUN npm install --legacy-peer-deps 
COPY client .
RUN npm run build

FROM node:16.20.2-alpine
WORKDIR /app
COPY --from=build /app/build /app/client/build
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 80
CMD ["npm", "start"]