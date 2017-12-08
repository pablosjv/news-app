FROM node
EXPOSE 3000
RUN mkdir /app
RUN npm install -g create-react-app
RUN npm install -g nodemon
WORKDIR /app
