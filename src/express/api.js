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

  getArticles({offset, limit}) {
    return this._load(`/articles`, {params: {offset, limit}});
  }

  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  getLatestComments(count) {
    return this._load(`/comments`, {params: {count}});
  }

  getMostDiscussedArticles(count) {
    return this._load(`/articles/discussed`, {params: {count}});
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data,
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
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
