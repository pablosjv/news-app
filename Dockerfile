FROM node
EXPOSE 3000
RUN mkdir /app
RUN npm install -g create-react-app; npm install react; npm install react-dom; npm install react-scripts
WORKDIR /app
