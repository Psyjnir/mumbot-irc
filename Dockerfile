FROM theta142/hubot-docker:latest

ENV HOME /home/hubot
WORKDIR $HOME

COPY --chown=hubot:hubot package.json ./
ADD --chown=hubot:hubot scripts ./scripts
COPY --chown=hubot:hubot external-scripts.json ./
COPY --chown=hubot:hubot hubot-scripts.json ./

RUN npm install --save

#RUN chown -R hubot:hubot ./

USER hubot

CMD bin/hubot --name mumbot --adapter irc

