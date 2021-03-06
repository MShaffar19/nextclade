FROM node:14.15.0-alpine3.12

COPY dist/*.js /usr/local/bin/
COPY dist/*.js.map /usr/local/bin/

RUN set -x \
&& cd /usr/local/bin/ \
&& ln -s nextclade.js nextclade

CMD '/usr/local/bin/nextclade.js'
