# Specify Node Version and Iamge 
FROM node:14 AS development 

WORKDIR /zhihan/src/app

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./

# Install deps inside container
RUN npm install

# RUN npm install @nestjs/config
# RUN npm install --save-dev @types/node
# RUN npm install @nestjs/typeorm typeorm pg

COPY . .

RUN npm run build

EXPOSE 3000

################
## PRODUCTION ##
################
# Build another image named production
FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /zhihan/src/app

COPY --from=development /zhihan/src/app .

EXPOSE 8080

# run app
CMD [ "node", "dist/main" ]


