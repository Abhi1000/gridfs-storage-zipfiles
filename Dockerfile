FROM node:15 as build

WORKDIR /home/node

COPY package*.json ./
COPY tsconfig.json ./
COPY ./definitions ./definitions
COPY ./src ./src

# If you are building your code for production
# RUN npm ci --only=production
RUN npm ci

RUN npm install -g typescript
RUN tsc --build tsconfig.json

FROM node:15 as runtime
WORKDIR /home/node

COPY --from=willwill/wait-for-it:latest /wait-for-it.sh /usr/bin/wait-for-it
RUN chmod a+rx /usr/bin/wait-for-it

COPY --from=build /home/node/package.json /home/node
COPY --from=build /home/node/built /home/node/built
COPY --from=build /home/node/node_modules /home/node/node_modules
COPY migrations/ /home/node/migrations
COPY start.sh /home/node

RUN chmod -R go-rwx /home/node
RUN chmod u+x start.sh

RUN chown -R node:node /home/node
USER node

EXPOSE 8080
EXPOSE 8081

ENTRYPOINT ["/home/node/start.sh"]
# CMD ["node", "./built/index.js"]

HEALTHCHECK --interval=5s --timeout=15s --start-period=60s --retries=3 CMD curl --fail http://localhost:3000