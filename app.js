const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');

const index = require('./routes/index');
const section = require('./routes/section');

const app = express();

const hbs = handlebars.create({
  helpers: {
    ifContains: (arg1, arg2, options) => {
      if (arg1.indexOf(arg2) !== -1) return options.fn(this);
      return '';
    },
    ifHasDay: (short, timeslots, options) => {
      let hasDay = false;
      timeslots.forEach((timeslot) => {
        if (timeslot.days.indexOf(short) !== -1) {
          hasDay = true;
        }
      });
      if (hasDay) {
        return options.fn(this);
      }

      return '';
    },
  },
});

app.use(require('connect-livereload')());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.view);
app.get('/section', section.view);

app.listen(process.env.PORT || 8080);
