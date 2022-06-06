'use strict';

const axios = require(`axios`);
const {DEFAULT_PORT} = require(`../constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || DEFAULT_PORT;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  getArticles() {
    return this._load(`/articles`);
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories() {
    return await this._load(`/categories`);
  }

  async createArticle(data) {
    return await this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }

  async _load(url, options) {
    const respose = await this._http.request({url, ...options});
    return respose.data;
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
