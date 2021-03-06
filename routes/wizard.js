const userStore = require('../helpers/userStore');
const resolvePath = require('resolve-path');
const path = require('path');
const jsonfile = require('jsonfile');
const clone = require('clone');

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
        course.hideSections = course.sections.length < 2;
        course.hideTimeslots = Object.keys(course.events_repeating).length < 1;
        const progress = ((req.user.wizard.index + 1) / req.user.wizard.courses.length) * 100;
        res.render('wizard', { user: req.user, course, progress });
      });
    });
  } else {
    req.flash('info', 'Please input at least one course to proceed!');
    res.redirect('/');
  }
};

exports.next = (req, res) => {
  if (!req.user.wizard || !('index' in req.user.wizard)) {
    res.redirect('/');
    return;
  }

  req.user.courses = Object.assign({}, req.user.courses);
  req.user.undo = clone(req.user.courses);

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
      req.flash('custom', `<span>Added ${Object.keys(courses).length} course(s) to calendar!</span><a href="/undo/calendar/Removed ${Object.keys(courses).length} recently added course(s) from calendar!" class="btn-flat toast-action">Undo</a>`);
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

        course.hideSections = course.sections.length < 2;
        course.hideTimeslots = Object.keys(course.events_repeating).length < 1;
        const progress = ((req.user.wizard.index + 1) / req.user.wizard.courses.length) * 100;
        res.render('wizard', {
          user: req.user,
          course,
          courseData: req.user.wizard.courseData[req.user.wizard.index],
          progress,
        });
      });
    });
  }
};
