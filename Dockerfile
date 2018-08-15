FROM node:8.1.1

ADD . /app
WORKDIR /app

EXPOSE 8081

RUN yarn && \ 
    node deploy/download && \
    rm dist.zip

CMD ["yarn","start"]
