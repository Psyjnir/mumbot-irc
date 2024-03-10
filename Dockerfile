FROM --platform=linux/amd64 theta142/hubot-docker:latest

ADD --chown=hubot:hubot scripts ./scripts
COPY --chown=hubot:hubot extra-packages.json ./
COPY --chown=hubot:hubot external-scripts.json ./

RUN npm install --save

CMD ./entrypoint.sh