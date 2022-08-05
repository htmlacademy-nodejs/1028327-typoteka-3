'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const user = require(`./user`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const {UserService} = require(`../data-service`);
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

const validUserData = {
  name: `Джарир Хуссейн`,
  email: `husain@example.com`,
  password: `husain`,
  passwordRepeated: `husain`,
  avatar: `husain.jpg`,
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

  user(app, new UserService(mockDB));
  return app;
};

describe(`API creates user if data is valid`, () => {
  let res;

  beforeAll(async () => {
    let app = await createAPI();
    res = await request(app).post(`/user`).send(validUserData);
  });

  test(`Status code 201`, () => expect(res.statusCode).toBe(HttpCode.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(validUserData)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, name: true},
      {...validUserData, email: 1},
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`},
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When passwords are not equal, code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not husain`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API authenticate user if data is valid`, () => {
  const validAuthData = {
    email: `ivanov@example.com`,
    password: `ivanov`,
  };

  let res;

  beforeAll(async () => {
    const app = await createAPI();
    res = await request(app)
      .post(`/user/auth`)
      .send(validAuthData);
  });

  test(`Status code is 200`, () => expect(res.statusCode).toBe(HttpCode.OK));
  test(`User name is Иван Иванов`, () => expect(res.body.name).toBe(`Иван Иванов`));
});

describe(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect status is 401`, async () => {
    const badAuthData = {
      email: `not-exist@example.com`,
      password: `petrov`,
    };

    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });

  test(`If password doesn't match status is 401`, async () => {
    const badAuthData = {
      email: `petrov@example.com`,
      password: `ivanov`,
    };

    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });
});

