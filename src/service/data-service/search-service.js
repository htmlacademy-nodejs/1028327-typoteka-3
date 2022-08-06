'use strict';

class SearchService {
  constructor(sequelize) {
    this._sequelize = sequelize;
  }

  async findAll(searchText) {
    const sql = `
      SELECT
        id,
        title,
        date
      FROM articles
      WHERE LOWER(articles.title) LIKE LOWER(?)
      ORDER BY articles.date DESC
    `;
    const replacements = [`%${searchText}%`];

    return this._sequelize.query(sql, {
      type: this._sequelize.QueryTypes.SELECT,
      replacements,
    });
  }
}

module.exports = SearchService;
