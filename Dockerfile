FROM node:10.15

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
COPY package*.json /usr/src/app/

# Install app dependencies
COPY package.json /usr/src/app/

RUN npm install -g typescript
RUN npm install
RUN tsc

EXPOSE 3003

CMD [ "npm", "run", "start" ]
