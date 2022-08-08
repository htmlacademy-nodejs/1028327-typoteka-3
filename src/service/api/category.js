'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/categories`, route);


  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK).json(categories);
  });


  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await service.create(req.body);

    res.status(HttpCode.CREATED).json(category);
  });


  route.put(`/:categoryId`,
      [routeParamsValidator, categoryValidator],
      async (req, res) => {
        const {categoryId} = req.params;
        const updatedCategory = await service.update(categoryId, req.body);

        if (!updatedCategory) {
          res.status(HttpCode.NOT_FOUND)
            .send(`Not found article with id ${categoryId}`);
          return;
        }

        res.status(HttpCode.OK).json(updatedCategory);
      },
  );


  route.delete(`/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;

    try {
      const category = await service.drop(categoryId);

      if (!category) {
        res.status(HttpCode.NOT_FOUND)
          .send(`Not found article with id ${categoryId}`);
        return;
      }

      res.status(HttpCode.OK).json(category);
    } catch (error) {
      res.status(HttpCode.INTERNAL_SERVER_ERROR).send({
        error: `Категория не может быть удалена, если ей принадлежит хотя бы одна публикация`,
      });
    }
  });


  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const category = await service.findOne(categoryId);

    const {
      count,
      articlesByCategory,
    } = await service.findPage({categoryId, limit, offset});

    res.status(HttpCode.OK).json({
      category,
      count,
      articlesByCategory,
    });
  });
};
