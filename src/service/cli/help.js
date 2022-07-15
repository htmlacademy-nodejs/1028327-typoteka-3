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
  --server <port>       запуск сервера на указаном порту или 3000
  --fill <count>        формирует файл fill-db.sql для заполнения базы данных
  --filldb <count>      создает базу данных и заполняет её моковыми данными
`;

module.exports = {
  name: `--help`,
  run() {
    console.log(chalk.gray(text));
  },
};
