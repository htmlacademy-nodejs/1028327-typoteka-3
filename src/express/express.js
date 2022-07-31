'use strict';

const path = require(`path`);
const express = require(`express`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);
const sequelize = require(`../service/lib/sequelize`);
const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {FRONT_DEFAULT_PORT} = require(`../constants`);

const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const FAVICON_DIR = `public/favicon`;

const {SESSION_SECRET} = process.env;
if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const app = express();

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000,
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));
app.use(express.static(path.resolve(__dirname, FAVICON_DIR)));
app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use((_req, res) => res.status(400).render(`errors/404`));
app.use((_err, _req, res) => res.status(500).render(`errors/500`));

app.listen(FRONT_DEFAULT_PORT);
