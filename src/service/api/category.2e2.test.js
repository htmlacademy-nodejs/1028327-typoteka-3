"use strict";

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const category = require(`./category`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const {CategoryService} = require(`../data-service`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Железо`,
  `Еда`,
  `Искусство`,
  `Музыка`,
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar-1.jpg`,
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar-2.jpg`,
  },
  {
    name: `Зураби Беридзе`,
    email: `beridze@example.com`,
    passwordHash: passwordUtils.hashSync(`beridze`),
    avatar: `avatar-3.jpg`,
  },
  {
    name: `Ганс Мюллер`,
    email: `gans@example.com`,
    passwordHash: passwordUtils.hashSync(`gans`),
    avatar: `avatar-4.jpg`,
  },
];

const mockArticles = [
  {
    user: `ivanov@example.com`,
    title: `Как начать программировать`,
    createdDate: `2022-04-12 20:59:39`,
    announce: `Это один из лучших рок-музыкантов.`,
    text: `В случае необходимости оставьте доверенность на адвоката, чтобы он мог представлять ваши интересы в суде без вашего присутствия. Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. В меню традиционные грузинские блюда с легким авторским акцентом.`,
    categories: [
      `Железо`,
      `Еда`,
      `Искусство`,
    ],
    comments: [],
  },
  {
    user: `gans@example.com`,
    title: `Ёлки. История деревьев`,
    createdDate: `2022-05-11 23:35:03`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    text: `В меню традиционные грузинские блюда с легким авторским акцентом. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Он написал больше 30 хитов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов.`,
    categories: [
      `Искусство`,
      `Железо`,
      `Еда`,
    ],
    comments: [],
  },
  {
    user: `beridze@example.com`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2022-03-13 22:50:31`,
    announce: `Как начать действовать? Для начала просто соберитесь. В случае необходимости оставьте доверенность на адвоката, чтобы он мог представлять ваши интересы в суде без вашего присутствия. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    text: `Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят.`,
    categories: [
      `Музыка`,
      `Еда`,
      `Искусство`,
    ],
    comments: [],
  },
  {
    user: `petrov@example.com`,
    title: `Рок — это протест`,
    createdDate: `2022-05-09 18:42:02`,
    announce: `К NFT растет интерес со стороны традиционного арт-рынка и традиционных коллекционеров. Приходи сюда утром в будние дни для неспешных завтраков с видом на просыпающийся город и обязательно заказывай кофе, сваренный на песке.`,
    text: `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Оплатите все штрафы, налоговые задолженности и пени, т.к. невыполненные платежные обязательства могут помешать вашему отъезду. Блюда и музыка такие, что хочется узнать рецепт и прошазамить. Сейчас большое количество людей в России принимают тяжелое решение: уезжать или нет. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. В случае необходимости оставьте доверенность на адвоката, чтобы он мог представлять ваши интересы в суде без вашего присутствия. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов.`,
    categories: [
      `Железо`,
      `Музыка`,
      `Еда`,
    ],
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Мне кажется или я уже читал это где-то?`,
      },
      {
        user: `beridze@example.com`,
        text: `Согласен с автором! Совсем немного... Планируете записать видосик на эту тему?`,
      },
    ],
  },
  {
    user: `gans@example.com`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdDate: `2022-05-08 05:47:55`,
    announce: `Покупка NFT-токена закрепляет за человеком право на владение цифровым объектом в интернете.`,
    text: `Приходи сюда утром в будние дни для неспешных завтраков с видом на просыпающийся город и обязательно заказывай кофе, сваренный на песке. Оплатите все штрафы, налоговые задолженности и пени, т.к. невыполненные платежные обязательства могут помешать вашему отъезду. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. В случае необходимости оставьте доверенность на адвоката, чтобы он мог представлять ваши интересы в суде без вашего присутствия. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    categories: [
      `Еда`,
      `Искусство`,
      `Музыка`,
    ],
    comments: [],
  },
];

const newCategory = {
  name: `Выйти из IT`,
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });

  const app = express();
  app.use(express.json());

  category(app, new CategoryService(mockDB));
  return app;
};

// test case 01
describe(`API returns category list`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () =>
    expect(res.body.length).toBe(4));
  test(`Category names are "Железо", "Еда", "Искусство", "Музыка"`, () =>
    expect(res.body.map((it) => it.name)).toEqual(
        expect.arrayContaining([`Железо`, `Еда`, `Искусство`, `Музыка`]),
    ));
});

// test case 02
describe(`API returns category with count`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/categories`).query({
      count: true,
    });
  });

  test(`Category has property "count"`, () => expect(res.body[0]).toHaveProperty(`count`));
  test(`First category has 3 articles`, () => expect(res.body[0].count).toBe(3));
});

// test case 03
describe(`API creates an category if data is valid`, () => {
  let app;
  let res;

  // const newCategory = {
  //   name: `Выйти из IT`,
  // };

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app).post(`/categories`).send(newCategory);
  });

  test(`Status code 201`, () => expect(res.statusCode).toBe(HttpCode.CREATED));
  test(`Categories count is changed`, () =>
    request(app)
      .get(`/categories`)
      .expect((response) => expect(response.body.length).toBe(5)));
});

// test case 04
describe(`API refuses to create an category if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    const invalidCategory = {
      name: `ААА`,
    };

    await request(app)
      .post(`/categories`)
      .send(invalidCategory)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When field type is wrong response code is 400`, async () => {
    const invalidCategory = {
      name: false,
    };

    await request(app)
      .post(`/categories`)
      .send(invalidCategory)
      .expect(HttpCode.BAD_REQUEST);
  });
});

// test case 05
describe(`API changes existent category`, () => {
  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app).put(`/categories/1`).send(newCategory);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Categories is really changed`, () =>
    request(app).get(`/categories`).expect((response) =>
      expect(response.body[0].name).toBe(`Выйти из IT`)));
});

// test case 06
test(`API returns code 404 when change non-existent category`, async () => {
  const app = await createAPI();

  return request(app)
    .put(`/categories/20`)
    .send(newCategory)
    .expect(HttpCode.NOT_FOUND);
});

// test case 07
test(`API returns code 400 when send a request invalid route`, async () => {
  const app = await createAPI();

  return request(app)
    .put(`/categories/NOEXST`)
    .send(newCategory)
    .expect(HttpCode.BAD_REQUEST);
});

// test case 08
describe(`API refuses when change an invalid category`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    const invalidCategory = {
      name: `ААА`,
    };

    await request(app)
      .put(`/categories/1`)
      .send(invalidCategory)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When field type is wrong response code is 400`, async () => {
    const invalidCategory = {
      name: false,
    };

    await request(app)
      .put(`/categories/1`)
      .send(invalidCategory)
      .expect(HttpCode.BAD_REQUEST);
  });
});

// test case 09
describe(`API correctly deletes a category`, () => {
  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app).delete(`/categories/1`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Category count is 4 now`, () => request(app).get(`/categories`)
      .expect((response) => expect(response.body.length).toBe(3)),
  );
});

// test case 10
test(`API refuses to delete non-existent category`, async () => {
  const app = await createAPI();

  return request(app).delete(`/categories/20`).expect(HttpCode.NOT_FOUND);
});

// test case 11
test(`API returns 400 when send a invalid request delete`, async () => {
  const app = await createAPI();

  return request(app).delete(`/categories/NOEXST`).expect(HttpCode.BAD_REQUEST);
});

// test case 12
describe(`API returns category list`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () =>
    expect(res.body.length).toBe(4));
  test(`Category names are "Железо", "Еда", "Искусство", "Музыка"`, () =>
    expect(res.body.map((it) => it.name)).toEqual(
        expect.arrayContaining([`Железо`, `Еда`, `Искусство`, `Музыка`]),
    ));
});
