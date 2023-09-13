const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const requestLogger = require('./middlewares/request.log');
const errorLogger = require('./middlewares/error.log');

require('dotenv').config(); // Cargar variables de entorno desde un archivo .env

// const { PORT, MONGODB_URI } = process.env;

const path = require('path');

const usersPath = path.join(__dirname, 'routes', 'users');
const users = require(usersPath);
const cardsPath = path.join(__dirname, 'routes', 'cards');
const cards = require(cardsPath);

const { login, createUser } = require('./controllers/users');

var cors = require('cors');

const app = express();

// Conexión a la base de datos
mongoose.connect('mongodb://127.0.0.1:27017/aroundb')
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.error(`Error connecting to the database. ${err}`);
  });

app.use(express.json());

app.use(users);
app.use(cards);

app.use(requestLogger);

app.use(cors());
app.options('*', cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', createUser);

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página principal!');
});

app.use(errorLogger);

// Middleware de manejo de errores de celebrate
app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});


// console.log(`Server running on port ${PORT}`);