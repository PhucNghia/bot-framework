from node:12
workdir /stc/node-docker
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 7070
CMD [ "node", "index.js" ]