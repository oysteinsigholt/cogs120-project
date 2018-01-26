const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');

const index = require('./routes/index');

const app = express();

app.use(require('connect-livereload')());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', handlebars());
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.view);

app.listen(process.env.PORT || 8080);
