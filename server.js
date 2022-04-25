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

const sess = {
  secret: process.env.secret,
  cookie: {},
  resave: false,
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
//The express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets. This is useful for front-end specific files like images, style sheets, and JavaScript files.
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))


// turn on routes
app.use(require('./controllers/'));

// turn on connection to db and server. force:true is to "DROP TABLE IF EXISTS". After creating a new association between tables, change to true, then restart the server. This will drop the tables so the application can re-create them and implement the association. **Make sure to change the connection back to false afterwards or it will drop the tables every time you restart the server.
sequelize.sync({ force: false})
.then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});