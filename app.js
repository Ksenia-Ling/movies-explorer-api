require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');

const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes/index');

const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(limiter);

app.use(cors);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());
app.use(requestLogger);

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
