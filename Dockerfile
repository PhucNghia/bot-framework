from node:12
RUN mkdir /code
workdir /code
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 7070
CMD [ "node", "index.js" ]