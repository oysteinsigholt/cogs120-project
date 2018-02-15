const userStore = require('../helpers/userStore');
const path = require('path');
const resolvePath = require('resolve-path');
const jsonfile = require('jsonfile');

exports.view = (req, res) => {
  res.render('manage', { user: req.user, hasCourses: 'courses' in req.user && Object.keys(req.user.courses).length > 0 });
};

exports.edit = (req, res) => {
  let courseFile = null;

  try {
    courseFile = resolvePath(path.resolve(__dirname, '..', 'data', 'courses'), `W18/${req.params.id}.json`);
  } catch (err) {
    console.log(err);
    res.status(500).send(':(');
    return;
  }

  jsonfile.readFile(courseFile, (err, course) => {
    if (err) {
      console.log(err);
      res.status(500).send(':(');
      return;
    }

    res.render('manage', {
      user: req.user, editing: true, course, courseData: req.user.courses[req.params.id],
    });
  });
};

exports.submit = (req, res) => {
  let timeslots = [];
  let sections = [];

  if (req.body.timeslot instanceof Array) {
    timeslots = req.body.timeslot;
  } else if (req.body.timeslot && req.body.timeslot.length > 0) {
    timeslots = [req.body.timeslot];
  }

  if (req.body.section instanceof Array) {
    sections = req.body.section;
  } else if (req.body.section && req.body.section.length > 0) {
    sections = [req.body.section];
  }

  req.user.courses[req.params.id] = Object.assign(req.user.courses[req.params.id], {
    sections: sections.reduce((map, obj) => {
      map[obj] = true;
      return map;
    }, {}),
    timeslots: timeslots.reduce((map, obj) => {
      map[obj] = true;
      return map;
    }, {}),
  });

  userStore.saveUser(req.user, () => {
    req.flash('custom', `<span>Updated ${req.params.id}!</span><button class="btn-flat toast-action" onclick="alert(\\'Undone!\\')">Undo</button>`);
    res.render('manage', { user: req.user, hasCourses: 'courses' in req.user && Object.keys(req.user.courses).length > 0 });
  });
};


exports.drop = (req, res) => {
  req.flash('custom', `<span>Removed ${req.params.id} from calendar!</span><button class="btn-flat toast-action" onclick="alert(\\'Undone!\\')">Undo</button>`);
  delete req.user.courses[req.params.id];
  userStore.saveUser(req.user, () => {
    res.render('manage', { user: req.user, hasCourses: 'courses' in req.user && Object.keys(req.user.courses).length > 0 });
  });
};
