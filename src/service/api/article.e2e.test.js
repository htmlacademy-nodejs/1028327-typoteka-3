"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const article = require(`./article`);
const initDB = require(`../lib/init-db`);
const {ArticleService, CommentService} = require(`../data-service`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Без рамки`,
  `Железо`,
  `Музыка`,
  `Деревья`,
  `IT`,
  `Еда`,
  `Кино`,
  `За жизнь`,
  `Релокация`,
  `Разное`,
  `Программирование`,
];

const mockArticles = [
  {
    title: `Обзор новейшего смартфона`,
    announce: `Приходи сюда утром в будние дни для неспешных завтраков с видом на просыпающийся город и обязательно заказывай кофе, сваренный на песке. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Блюда и музыка такие, что хочется узнать рецепт и прошазамить.`,
    text: `К NFT растет интерес со стороны традиционного арт-рынка и традиционных коллекционеров. Он написал больше 30 хитов. Блюда и музыка такие, что хочется узнать рецепт и прошазамить.`,
    categories: [
      `Без рамки`,
      `Железо`,
      `Музыка`,
    ],
    comments: [],
  },
  {
    title: `Самый лучший музыкальный альбом этого года`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов.`,
    text: `Это один из лучших рок-музыкантов. NFT — это невероятная возможность для художников вывести творчество на новый уровень. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Как начать действовать? Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    categories: [
      `Деревья`,
      `IT`,
      `Еда`,
    ],
    comments: [
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {

        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
  },
  {
    title: `Учим HTML и CSS`,
    announce: `К NFT растет интерес со стороны традиционного арт-рынка и традиционных коллекционеров. Программировать не настолько сложно, как об этом говорят.`,
    text: `Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Блюда и музыка такие, что хочется узнать рецепт и прошазамить. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Сейчас большое количество людей в России принимают тяжелое решение: уезжать или нет. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    categories: [
      `Кино`,
      `Железо`,
      `Музыка`,
    ],
    comments: [],
  },
  {
    title: `Что такое золотое сечение`,
    announce: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.`,
    text: `Блюда и музыка такие, что хочется узнать рецепт и прошазамить. NFT — это невероятная возможность для художников вывести творчество на новый уровень. Золотое сечение — соотношение двух величин, гармоническая пропорция. В случае необходимости оставьте доверенность на адвоката, чтобы он мог представлять ваши интересы в суде без вашего присутствия. К NFT растет интерес со стороны традиционного арт-рынка и традиционных коллекционеров. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    categories: [
      `За жизнь`,
      `Релокация`,
      `IT`,
    ],
    comments: [
      {
        text: `Это где ж такие красоты?`,
      },
      {
        text: `Плюсую, но слишком много буквы! Хочу такую же футболку :-)`,
      },
      {
        text: `Планируете записать видосик на эту тему?`,
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Согласен с автором!`,
      },
    ],
  },
  {
    title: `Как достигнуть успеха не вставая с кресла`,
    announce: `Достичь успеха помогут ежедневные повторения.`,
    text: `Достичь успеха помогут ежедневные повторения. Блюда и музыка такие, что хочется узнать рецепт и прошазамить. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Приходи сюда утром в будние дни для неспешных завтраков с видом на просыпающийся город и обязательно заказывай кофе, сваренный на песке. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Из под его пера вышло 8 платиновых альбомов.`,
    categories: [
      `Разное`,
      `Еда`,
      `Программирование`,
    ],
    comments: [
      {
        text: `Мне кажется или я уже читал это где-то?`,
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        text: `Планируете записать видосик на эту тему?`,
      },
    ],
  },
];

const newArticle = {
  title: `Как правильно гладить котика. Все секреты правильного поглаживания.`,
  announce: `В чем смысл этого материала? В кошках, конечно! Существует немало исследований, в которых ученые пытались понять различные аспекты обращения с домашними животными. Мы остановились на главной проблеме — и объясняем, как правильно гладить котов.`,
  categories: [1, 2],
  date: `2022-07-19T12:46:09.607Z`,
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
  });

  const app = express();
  app.use(express.json());

  article(app, new ArticleService(mockDB), new CommentService(mockDB));
  return app;
};

// test case 01
describe(`API returns a list of all articles`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () =>
    expect(res.body.length).toBe(5));
  test(
      `First article's title equals "Обзор новейшего смартфона"`,
      () => expect(res.body.find((item) => item.id === 1).title)
        .toBe(`Обзор новейшего смартфона`),
  );
});

// test case 02
describe(`API returns an article with given id`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Обзор новейшего смартфона"`, () =>
    expect(res.body.title).toBe(`Обзор новейшего смартфона`));
});

// test case 03
describe(`API creates an article if data is valid`, () => {
  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(res.statusCode).toBe(HttpCode.CREATED));
  test(`Article has property "date"`, () =>
    expect(res.body.hasOwnProperty(`date`)).toEqual(true));
  test(`Articles count is changed`, () =>
    request(app)
      .get(`/articles`)
      .expect((response) => expect(response.body.length).toBe(6)));
});

// test case 04
describe(`API refuses to create an article if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: true},
      {...newArticle, date: 20},
      {...newArticle, announce: [1, 2]},
      {...newArticle, categories: `Котики`},
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: ``},
      {...newArticle, date: `Mon Aug 20 2012 09:06:56`},
      {...newArticle, announce: `too short`},
      {...newArticle, categories: []},
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

// test case 05
describe(`API changes existent article`, () => {
  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app).put(`/articles/1`).send(newArticle);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, () =>
    request(app).get(`/articles/1`).expect((response) =>
      expect(response.body.title).toBe(`Как правильно гладить котика. Все секреты правильного поглаживания.`)));
});

// test case 06
test(`API returns code 404 when change non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
});

// test case 07
test(`API returns code 400 when change an invalid article`, async () => {
  const invalidArticle = {
    title: `Это`,
    text: `невалидный объект`,
    categories: [`статьи`],
    comments: `нет поля announce`,
  };

  const app = await createAPI();

  return request(app)
    .put(`/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

// test case 08
describe(`API correctly deletes an article`, () => {
  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app).delete(`/articles/2`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Article count is 4 now`, () => request(app).get(`/articles`)
      .expect((response) => expect(response.body.length).toBe(4)),
  );
});

// test case 09
test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(HttpCode.NOT_FOUND);
});

// test case 10
describe(`API returns a list of comments to given article`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/articles/4/comments`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 comments`, () => expect(res.body.length).toBe(4));
  test(`First comment's text is "Это где ж такие красоты?"`, () =>
    expect(res.body[0].text).toBe(`Это где ж такие красоты?`));
});

// test case 11
describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`,
  };

  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app)
      .post(`/articles/3/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () =>
    expect(res.statusCode).toBe(HttpCode.CREATED));
  test(`Comments count is changed`, () =>
    request(app)
      .get(`/articles/3/comments`)
      .expect((response) => expect(response.body.length).toBe(1)));
});

// test case 12
test(`API returns 404 when create a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);
});

// test case 13
test(`API returns code 400 when create a invalid comment`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

// test case 14
describe(`API correctly deletes a comment`, () => {
  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app)
      .delete(`/articles/2/comments/1`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/2/comments`)
    .expect((response) => expect(response.body.length).toBe(1)));
});

// test case 15
test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/2/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

// test case 16
test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});

// test case 17
describe(`API returns a list of all comments`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/comments`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 9 comments`, () =>
    expect(res.body.length).toBe(9));
});

// test case 18
describe(`API returns a list of 4 comments`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/comments?count=4`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 comments`, () =>
    expect(res.body.length).toBe(4));
});
