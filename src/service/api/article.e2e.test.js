"use strict";

const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);
const {ArticleService, CommentService} = require(`../data-service`);
const {HttpCode} = require(`../../constants`);

const mockData = [{
  id: `nsg2yM`,
  title: `Обзор новейшего смартфона`,
  createdDate: `2022-05-28 20:52:49`,
  announce: `Приходи сюда утром в будние дни для неспешных завтраков с видом на просыпающийся город и обязательно заказывай кофе, сваренный на песке. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Блюда и музыка такие, что хочется узнать рецепт и прошазамить.`,
  fullText: `К NFT растет интерес со стороны традиционного арт-рынка и традиционных коллекционеров. Он написал больше 30 хитов. Блюда и музыка такие, что хочется узнать рецепт и прошазамить.`,
  сategory: [
    `Без рамки`,
    `Железо`,
    `Музыка`,
  ],
  comments: [],
}, {
  id: `SKPYLj`,
  title: `Самый лучший музыкальный альбом этого года`,
  createdDate: `2022-03-16 06:05:27`,
  announce: `Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов.`,
  fullText: `Это один из лучших рок-музыкантов. NFT — это невероятная возможность для художников вывести творчество на новый уровень. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  сategory: [
    `Деревья`,
    `IT`,
    `Еда`,
  ],
  comments: [{
    id: `hrLU-R`,
    text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
  }, {
    id: `CiPdDh`,
    text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
  }],
}, {
  id: `pPFukW`,
  title: `Учим HTML и CSS`,
  createdDate: `2022-03-30 21:46:49`,
  announce: `К NFT растет интерес со стороны традиционного арт-рынка и традиционных коллекционеров. Программировать не настолько сложно, как об этом говорят.`,
  fullText: `Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Блюда и музыка такие, что хочется узнать рецепт и прошазамить. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Сейчас большое количество людей в России принимают тяжелое решение: уезжать или нет. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
  сategory: [
    `Кино`,
    `Железо`,
    `Музыка`,
  ],
  comments: [],
}, {
  id: `JQgNKw`,
  title: `Что такое золотое сечение`,
  createdDate: `2022-03-22 16:24:59`,
  announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.`,
  fullText: `Блюда и музыка такие, что хочется узнать рецепт и прошазамить. NFT — это невероятная возможность для художников вывести творчество на новый уровень. Золотое сечение — соотношение двух величин, гармоническая пропорция. В случае необходимости оставьте доверенность на адвоката, чтобы он мог представлять ваши интересы в суде без вашего присутствия. К NFT растет интерес со стороны традиционного арт-рынка и традиционных коллекционеров. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  сategory: [
    `За жизнь`,
    `Релокация`,
    `IT`,
  ],
  comments: [{
    id: `dDG3_k`,
    text: `Это где ж такие красоты?`,
  }, {
    id: `bfDzeb`,
    text: `Плюсую, но слишком много буквы! Хочу такую же футболку :-)`,
  }, {
    id: `ktMjb2`,
    text: `Планируете записать видосик на эту тему?`,
  }, {
    id: `jUvV1T`,
    text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Согласен с автором!`,
  }],
}, {
  id: `-X8y-I`,
  title: `Как достигнуть успеха не вставая с кресла`,
  createdDate: `2022-05-08 01:02:38`,
  announce: `Достичь успеха помогут ежедневные повторения.`,
  fullText: `Достичь успеха помогут ежедневные повторения. Блюда и музыка такие, что хочется узнать рецепт и прошазамить. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Приходи сюда утром в будние дни для неспешных завтраков с видом на просыпающийся город и обязательно заказывай кофе, сваренный на песке. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов.`,
  сategory: [
    `Разное`,
    `Еда`,
    `Программирование`,
  ],
  comments: [{
    id: `PNemMB`,
    text: `Мне кажется или я уже читал это где-то?`,
  }, {
    id: `ywNfOb`,
    text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
  }, {
    id: `oG8Zcc`,
    text: `Планируете записать видосик на эту тему?`,
  }],
}];

const newArticle = {
  title: `Как правильно гладить котика`,
  createdDate: `2022-05-29 14:24:38`,
  announce: `Все секреты правильного поглаживания`,
  сategory: [`Искусство`, `Разное`],
};

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));

  app.use(express.json());
  article(app, new ArticleService(cloneData), new CommentService());

  return app;
};

// test case 01
describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () =>
    expect(res.body.length).toBe(5));
  test(`First article's id equals "nsg2yM"`, () =>
    expect(res.body[0].id).toBe(`nsg2yM`));
});

// test case 02
describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app).get(`/articles/nsg2yM`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Обзор новейшего смартфона"`, () =>
    expect(res.body.title).toBe(`Обзор новейшего смартфона`));
});

// test case 03
describe(`API creates an article if data is valid`, () => {
  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(res.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () =>
    expect(res.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((response) => expect(response.body.length).toBe(6)));
});

// test case 04
describe(`API refuses to create an article if data is invalid`, () => {
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badOffer = {...newArticle};
      delete badOffer[key];
      await request(app)
        .post(`/articles`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

// test case 05
describe(`API changes existent article`, () => {
  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app).put(`/articles/nsg2yM`).send(newArticle);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () =>
    expect(res.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () =>
    request(app)
      .get(`/articles/nsg2yM`)
      .expect((response) =>
        expect(response.body.title).toBe(`Как правильно гладить котика`)));
});

// test case 06
test(`API returns status code 404 when change non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

// test case 07
test(`API returns status code 400 when change an invalid article`, () => {
  const invalidArticle = {
    title: `Это`,
    announce: `невалидный`,
    fullText: `объект`,
    сategory: `статьи`,
    comments: `нет поля createdDate`,
  };

  const app = createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

// test case 08
describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app).delete(`/articles/JQgNKw`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(res.body.id).toBe(`JQgNKw`));
  test(`Article count is 4 now`, () =>
    request(app)
      .get(`/articles`)
      .expect((response) => expect(response.body.length).toBe(4)),
  );
});

// test case 09
test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});

// test case 10
describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app).get(`/articles/SKPYLj/comments`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 comments`, () => expect(res.body.length).toBe(2));
  test(`First comment's id is "hrLU-R"`, () =>
    expect(res.body[0].id).toBe(`hrLU-R`));
});

// test case 11
describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`,
  };

  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app)
      .post(`/articles/SKPYLj/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () =>
    expect(res.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () =>
    expect(res.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () =>
    request(app)
      .get(`/articles/SKPYLj/comments`)
      .expect((response) => expect(response.body.length).toBe(3)));
});

// test case 12
test(`API returns 404 when create a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);
});

// test case 13
test(`API returns status code 400 when create a invalid comment`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/SKPYLj/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

// test case 14
describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let res;

  beforeAll(async () => {
    res = await request(app)
      .delete(`/articles/SKPYLj/comments/CiPdDh`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(res.body.id).toBe(`CiPdDh`));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/SKPYLj/comments`)
    .expect((response) => expect(response.body.length).toBe(1)));
});

// test case 15
test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/SKPYLj/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

// test case 16
test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/CiPdDh`)
    .expect(HttpCode.NOT_FOUND);
});
