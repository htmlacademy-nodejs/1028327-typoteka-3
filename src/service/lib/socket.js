'use strict';

const {Server} = require(`socket.io`);
const {
  HttpMethod,
  FRONT_DEFAULT_PORT,
} = require(`../../constants`);

module.exports = (server) => {
  return new Server(server, {
    cors: {
      origins: [`localhost:${FRONT_DEFAULT_PORT}`],
      methods: [HttpMethod.GET],
    },
  });
};
