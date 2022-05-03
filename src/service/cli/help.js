'use strict';

const chalk = require(`chalk`);

const text = `
Программа запускает http-сервер и формирует файл с данными для api.
Гайд:
  server <command>
  Команды:
  --version:            выводит номер версии
  --help:               печатает этот текст
  --generate <count>    формирует файл mocks.json
`;

module.exports = {
  name: `--help`,
  run() {
    console.log(chalk.gray(text));
  }
};
