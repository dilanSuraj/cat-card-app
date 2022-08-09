FROM node:16.13.2

LABEL version="1.0"
LABEL description="This is the base docker image for the cat-card-app using Node.js"
LABEL maintainer = ["dilan.amarasinghe214263@gmail.com"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN ls
RUN npm install
COPY . ./

CMD ["npm", "start"]