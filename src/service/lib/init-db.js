'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, articles}) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((category) => ({name: category})),
  );

  const categoryIdByName = categoryModels.reduce((acc, item) => ({
    [item.name]: item.id,
    ...acc,
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(
        article,
        {include: [Aliase.COMMENTS]},
    );
    await articleModel.addCategories(
        article.categories.map(
            (name) => categoryIdByName[name],
        ),
    );
  });

  await Promise.all(articlePromises);
};
