FROM node:16.20.2-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install --legacy-peer-deps 
COPY . .
RUN npm run build

FROM node:16.20.2-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build /app/build
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]