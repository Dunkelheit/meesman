FROM camilin87/node-cron:latest
ENV TASK_SCHEDULE='0 18 * * *'
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install