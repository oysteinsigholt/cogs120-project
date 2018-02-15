const resolvePath = require('resolve-path');
const path = require('path');
const jsonfile = require('jsonfile');

exports.view = (req, res) => {
  let courseFile = null;
  const quarter = 'W18';

  const courses = {
    events_repeating: {
      M: [],
      Tu: [],
      W: [],
      Th: [],
      F: [],
      Sa: [],
      Su: [],
    },
  };

  let hasCourses = true;

  if (!('courses' in req.user)) {
    req.user.courses = {};
  }
  if (Object.keys(req.user.courses).length < 1) {
    hasCourses = false;
  }

  for (let i = 0; i < Object.keys(req.user.courses).length; i += 1) {
    const id = Object.keys(req.user.courses)[i];
    try {
      courseFile = resolvePath(path.resolve(__dirname, '..', 'data', 'courses'), `${quarter}/${id}.json`);
      const course = jsonfile.readFileSync(courseFile);
      for (let j = 0; j < Object.keys(course.events_repeating).length; j += 1) {
        const day = Object.keys(course.events_repeating)[j];

        for (let k = 0; k < Object.keys(course.events_repeating[day]).length; k += 1) {
          const timeslotId = Object.keys(course.events_repeating[day])[k];
          const timeslot = course.events_repeating[day][timeslotId];

          timeslot.id = timeslotId;
          timeslot.course = id;
          if (timeslotId in req.user.courses[timeslot.course].timeslots) {
            courses.events_repeating[day].push(timeslot);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  Object.keys(courses.events_repeating).forEach((day) => {
    if (courses.events_repeating[day].length === 0) {
      delete courses.events_repeating[day];
    } else {
      courses.events_repeating[day].sort((a, b) => {
        if (a.start_time < b.start_time) return -1;
        if (a.start_time > b.start_time) return 1;
        return 0;
      });
    }
  });
  
  res.render('calendar', { user: req.user, courses, hasCourses });
};
