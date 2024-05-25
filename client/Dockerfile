# Specify Node Version and Iamge 
FROM node:14 AS development 

WORKDIR /zhihan/client/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli

COPY . .

RUN npm run build

EXPOSE 4200
