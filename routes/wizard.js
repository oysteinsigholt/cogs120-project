const userStore = require('../helpers/userStore');
const resolvePath = require('resolve-path');
const path = require('path');
const jsonfile = require('jsonfile');

exports.post = (req, res) => {
  let newCourses = [];

  if (req.body.chip instanceof Array) {
    newCourses = req.body.chip;
  } else if (req.body.chip && req.body.chip.length > 0) {
    newCourses = [req.body.chip];
  }

  if (newCourses.length > 0) {
    if (!('courses' in req.user)) req.user.courses = [];

    req.user.wizard = {
      courses: newCourses,
      courseData: {},
      index: 0,
      length: newCourses.length,
      final: newCourses.length === 1,
    };

    userStore.saveUser(req.user, () => {
      let courseFile = null;

      const quarter = 'W18';
      const id = req.user.wizard.courses[req.user.wizard.index].split(':')[0];

      try {
        courseFile = resolvePath(path.resolve(__dirname, '..', 'data', 'courses'), `${quarter}/${id}.json`);
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
        res.render('wizard', { user: req.user, course });
      });
    });
  } else {
    res.redirect('/');
  }
};

exports.next = (req, res) => {
  const { index } = req.user.wizard;
  const action = req.body.action || 'back';

  if (req.body.action && req.body.action === 'next') {
    req.user.wizard.index += 1;
  } else {
    req.user.wizard.index -= 1;
  }

  if (req.user.wizard.index >= req.user.wizard.length - 1) {
    req.user.wizard.final = true;
  } else {
    req.user.wizard.final = false;
  }

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

  req.user.wizard.courseData[index] = {
    name: req.user.wizard.courses[index].split(':')[1],
    desc: 'loremipsumhello',
    sections: sections.reduce((map, obj) => {
      map[obj] = true;
      return map;
    }, {}),
    timeslots: timeslots.reduce((map, obj) => {
      map[obj] = true;
      return map;
    }, {}),
  };

  if (req.user.wizard.index >= req.user.wizard.length && action === 'next') {
    const courses = {};
    for (let i = 0; i < req.user.wizard.courses.length; i += 1) {
      courses[req.user.wizard.courses[i].split(':')[0]] = req.user.wizard.courseData[i];
    }

    req.user.courses = Object.assign({}, req.user.courses, courses);
    req.user.wizard = null;

    userStore.saveUser(req.user, () => {
      req.flash('custom', `<span>Added ${Object.keys(courses).length} course(s) to calendar!</span><button class="btn-flat toast-action" onclick="alert(\\'Unimplemented\\')">Undo</button>`);
      res.redirect('/calendar');
    });
  } else if (req.user.wizard.index < 0 && action === 'back') {
    req.user.wizard = null;

    userStore.saveUser(req.user, () => {
      res.redirect('/');
    });
  } else {
    userStore.saveUser(req.user, () => {
      let courseFile = null;

      const quarter = 'W18';
      const id = req.user.wizard.courses[req.user.wizard.index].split(':')[0];

      try {
        courseFile = resolvePath(path.resolve(__dirname, '..', 'data', 'courses'), `${quarter}/${id}.json`);
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
        res.render('wizard', { user: req.user, course, courseData: req.user.wizard.courseData[req.user.wizard.index] });
      });
    });
  }
};
