'use strict';

const {hash, hashSync} = require(`bcrypt`);

const SALT_ROUNDS = 10;

module.exports = {
  hash: async (password) => await hash(password, SALT_ROUNDS),
  hashSync: (password) => hashSync(password, SALT_ROUNDS),
};
