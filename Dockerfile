FROM node:alpine
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run" ,"serve" ]
ENV NODEMIN.REDIS_URL 'redis://redis:6379'
COPY . .
