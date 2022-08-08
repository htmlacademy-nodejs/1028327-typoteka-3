'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const comment = require(`./comment`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const {HttpCode} = require(`../../constants`);
const {
  ArticleService,
  CommentService,
} = require(`../data-service`);

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
    user: `petrov@example.com`,
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
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        user: `gans@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
  },
  {
    user: `beridze@example.com`,
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
    user: `gans@example.com`,
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
        user: `beridze@example.com`,
        text: `Это где ж такие красоты?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Плюсую, но слишком много буквы! Хочу такую же футболку :-)`,
      },
      {
        user: `gans@example.com`,
        text: `Планируете записать видосик на эту тему?`,
      },
      {
        user: `petrov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Согласен с автором!`,
      },
    ],
  },
  {
    user: `ivanov@example.com`,
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
        user: `petrov@example.com`,
        text: `Мне кажется или я уже читал это где-то?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        user: `gans@example.com`,
        text: `Планируете записать видосик на эту тему?`,
      },
    ],
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });

  const app = express();
  app.use(express.json());

  comment(app, new ArticleService(mockDB), new CommentService(mockDB));
  return app;
};

// test case 01
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

// test case 02
describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    userId: 2,
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

// test case 03
test(`API returns 404 when create a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/20/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.NOT_FOUND);
});

// test case 04
test(`API returns 400 when create a comment to invalid route`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({text: `Неважно`})
    .expect(HttpCode.BAD_REQUEST);
});

// test case 05
test(`API returns code 400 when create a invalid comment`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

// test case 06
describe(`API correctly deletes a comment`, () => {
  let app;
  let res;

  beforeAll(async () => {
    app = await createAPI();
    res = await request(app)
      .delete(`/articles/comments/1`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/2/comments`)
    .expect((response) => expect(response.body.length).toBe(1)));
});

// test case 07
test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/comments/20`)
    .expect(HttpCode.NOT_FOUND);
});

// test case 08
test(`API refuses to delete invalid id comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/comments/NOEXST`)
    .expect(HttpCode.BAD_REQUEST);
});

// test case 09
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

// test case 10
describe(`API returns a list of 4 comments`, () => {
  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app).get(`/comments?limit=4`);
  });

  test(`Status code 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 4 comments`, () =>
    expect(res.body.length).toBe(4));
});
