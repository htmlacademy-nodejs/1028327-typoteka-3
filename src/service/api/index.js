'use strict';

const {Router} = require(`express`);
const getMockData = require(`../lib/get-mock-data`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  app.get(`/`, (req, res) => {
    res.json(mockData);
  });
})();

module.exports = app;
