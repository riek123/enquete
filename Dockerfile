FROM node:onbuild

RUN npm install --production

CMD node ./app.js