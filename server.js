const path = require('path');
const express = require('express');
const session = require('express-session');
//code to set up Handlebars.js as the app's template engine of choice
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

require('dotenv').config();

const minute = 60000
const sess = {
  secret: process.env.secret,
  //timeout after 5 minutes
  cookie: { maxAge: minute * 5 },
  rolling: true,
  resave: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}

app.use(session(sess))

const helpers = require('./utils/helpers')

const hbs = exphbs.create({helpers});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))


// turn on routes
app.use(require('./controllers/'));

sequelize.sync({ force: false})
.then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});