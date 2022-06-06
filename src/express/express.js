'use strict';

const path = require(`path`);
const express = require(`express`);

const articlesRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const FAVICON = `public/favicon`;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, FAVICON)));
app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use((req, res) => res.status(400).render(`errors/404`));
app.use((err, req, res) => res.status(500).render(`errors/500`));

app.listen(DEFAULT_PORT);
