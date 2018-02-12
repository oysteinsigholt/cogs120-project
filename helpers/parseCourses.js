const jsonfile = require('jsonfile');

const courses = jsonfile.readFileSync('./data/courses.json');

function isUnknown(timeslot) {
  if (timeslot.days === 'TBA') return true;
  return false;
}

function isSingle(timeslot) {
  if ((timeslot.section.match(/\//g) || []).length === 2) return true;
  return false;
}

function parseTime(time) {
  /* Based on http://jsfiddle.net/L2y2d/1/ by https://stackoverflow.com/users/1058605/adrian-p */
  let hours = Number(time.match(/^(\d+)/)[1]);
  const minutes = Number(time.match(/:(\d+)/)[1]);
  const AMPM = time.slice(-1);

  if (AMPM === 'p' && hours < 12) hours += 12;
  if (AMPM === 'a' && hours === 12) hours -= 12;

  return (`${hours}:${minutes.toString().padStart(2, '0')}`);
}

function dumpNames() {
  const courseList = { courses: [] };

  Object.keys(courses).forEach((key) => {
    const course = courses[key];
    courseList.courses.push(`${key}: ${course.name}`);
  });

  jsonfile.writeFileSync('./data/courses/W18/courses.json', courseList);
}

function parseDays(dayString) {
  const days = [];

  if (dayString.indexOf('M') > -1) {
    days.push('M');
  }
  if (dayString.indexOf('Tu') > -1) {
    days.push('Tu');
  }
  if (dayString.indexOf('W') > -1) {
    days.push('W');
  }
  if (dayString.indexOf('Th') > -1) {
    days.push('Th');
  }
  if (dayString.indexOf('F') > -1) {
    days.push('F');
  }
  if (dayString.indexOf('Sa') > -1) {
    days.push('Sa');
  }
  if (dayString.indexOf('Su') > -1) {
    days.push('Su');
  }

  return days;
}

function dumpCourses() {
  Object.keys(courses).forEach((key) => {
    const course = courses[key];
    course.events_single = [];
    course.events_unknown = [];
    course.events_repeating = {
      M: [],
      Tu: [],
      W: [],
      Th: [],
      F: [],
      Sa: [],
      Su: [],
    };

    for (let i = 0; i < course.timeslots.length; i += 1) {
      const timeslot = course.timeslots[i];

      if (isUnknown(timeslot)) {
        course.events_unknown.push(timeslot);
      } else if (isSingle(timeslot)) {
        timeslot.date = new Date(timeslot.section).toISOString();
        timeslot.start_time = null;
        timeslot.end_time = null;

        const times = timeslot.time.split('-');
        if (times.length === 2) {
          timeslot.start_time = parseTime(times[0]);
          timeslot.end_time = parseTime(times[1]);
        }

        course.events_single.push(timeslot);
      } else {
        timeslot.start_time = null;
        timeslot.end_time = null;

        const times = timeslot.time.split('-');
        if (times.length === 2) {
          timeslot.start_time = parseTime(times[0]);
          timeslot.end_time = parseTime(times[1]);
        }

        const days = parseDays(timeslot.days);

        for (let j = 0; j < days.length; j += 1) {
          course.events_repeating[days[j]].push(timeslot);
        }
      }
    }

    jsonfile.writeFileSync(`./data/courses/W18/${course.code}.json`, course, { spaces: 2 });
  });
}

dumpNames();
dumpCourses();

module.exports = { dumpNames };
