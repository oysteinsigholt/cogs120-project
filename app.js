const jsonfile = require('jsonfile');
const express = require('express');
const path = require('path');
const fs = require('fs');
const handlebars = require('express-handlebars');
const flash = require('express-flash');
const abbreviations = require('./helpers/abbreviations');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ensureLogin = require('connect-ensure-login').ensureLoggedIn();

const index = require('./routes/index');
const about = require('./routes/about');
const help = require('./routes/help');
const calendar = require('./routes/calendar');
const calendarB = require('./routes/calendarB');
const section = require('./routes/section');
const wizard = require('./routes/wizard');
const manage = require('./routes/manage');
const login = require('./routes/login');
const undo = require('./routes/undo');
const ical = require('./routes/ical');

const env = process.env.NODE_ENV || 'dev';

let callbackURL = 'http://localhost:8080/auth/google/callback';

if (env !== 'dev') {
  callbackURL = 'https://a9-ucsdplan.herokuapp.com/auth/google/callback';
}

function sumTxt(txt) {
  return txt.split('').map((c) => {
    return c.charCodeAt(0);
  }).reduce((a, b) => {
    return a + b;
  }, 0);
}

const app = express();
const hbs = handlebars.create({
  helpers: {
    isChecked: (id, courseData) => {
      if (courseData && courseData.sections && id in courseData.sections) {
        return 'checked';
      }
      if (courseData && courseData.timeslots && id in courseData.timeslots) {
        return 'checked';
      }
      return '';
    },
    unabbreviateDay: (abbr) => {
      if (abbr.toLowerCase() in abbreviations.days) {
        return abbreviations.days[abbr.toLowerCase()];
      }
      return abbr;
    },
    unabbreviateType: (abbr) => {
      if (abbr.toLowerCase() in abbreviations.types) {
        return abbreviations.types[abbr.toLowerCase()];
      }
      return abbr;
    },
    colorCard: (course, type) => {
      const colors = ['red', 'pink', 'purple', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'amber', 'orange'];
      const colorID = sumTxt(course) % colors.length;
      if (type === "LE") return colors[colorID] + ' darken-2';
      return colors[colorID] + ' darken-4';
    },
  },
});

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL,
  },
  (accessToken, refreshToken, profile, cb) => cb(null, profile),
));

passport.serializeUser((user, done) => {
  const file = path.resolve(__dirname, 'data', 'users', `${user.id}.json`);

  if (!fs.existsSync(file)) {
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file));
    }

    jsonfile.writeFile(file, user, (err) => {
      if (err) console.log(err);
      done(err, user.id);
    });
  } else {
    done(null, user.id);
  }
});

passport.deserializeUser((id, done) => {
  jsonfile.readFile(path.resolve(__dirname, 'data', 'users', `${id}.json`), (err, user) => {
    if (err) console.log(err);
    done(err, user);
  });
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'ke3p iT sEcreT, KeeP iT EdGy', resave: true, saveUninitialized: true }));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

if (env === 'dev') {
  // eslint-disable-next-line global-require
  app.use(require('connect-livereload')());
}

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', login.view);

app.get('/', ensureLogin, index.view);
app.get('/about', about.view);
app.get('/help', help.view);

//app.get('/calendar', ensureLogin, calendar.view);
//app.get('/calendar_b', ensureLogin, calendarB.view);
app.get('/calendar', ensureLogin, calendarB.view);

app.get('/manage', ensureLogin, manage.view);
app.get('/manage/drop/:id', ensureLogin, manage.drop);
app.get('/manage/edit/:id', ensureLogin, manage.edit);
app.post('/manage/edit/:id', ensureLogin, manage.submit);

app.get('/undo/:path/:message', ensureLogin, undo.view);

app.get('/section/:quarter/:course', ensureLogin, section.view);

app.get('/wizard', (req, res) => {
  res.redirect('/');
});
app.post('/wizard', ensureLogin, wizard.post);
app.post('/wizard/next', ensureLogin, wizard.next);
app.get('/ical/:id', ical.view);

app.get(
  '/login',
  (req, res) => {
    res.render('login');
  },
);

app.get('/logout', (req, res) => {
  req.flash('info', 'Successfully signed out!');
  req.logout();
  res.redirect('/');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    jsonfile.readFile(path.resolve(__dirname, 'data', 'users', `${req.user.id}.json`), (err, user) => {
      if ('courses' in user) {
        req.flash('info', `Welcome back, ${req.user.name.givenName}!`);
        res.redirect('/calendar');
      } else {
        req.flash('info', `Welcome to UCSD Planner, ${req.user.name.givenName}! Add some courses to get started!`);
        res.redirect('/');
      }
    });
  },
);

app.listen(process.env.PORT || 8080);
