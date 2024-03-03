FROM node
WORKDIR /app
COPY package.json /app
COPY ./dist ./dist
RUN npm install
EXPOSE 5000
CMD [ "npm", "run", "start" ]