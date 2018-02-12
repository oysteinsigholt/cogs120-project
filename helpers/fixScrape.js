const jsonfile = require('jsonfile');

const courses = jsonfile.readFileSync('../courses.json');

Object.keys(courses).forEach((key) => {
  const course = courses[key];

  for (let i = 0; i < course.timeslots.length; i += 1) {
    const timeslot = course.timeslots[i];
    let instructors = [];

    instructors = timeslot.instructor.replace(/\t/g, '').split('\n');
    instructors = instructors.filter(n => n.trim().length > 0);

    instructors = instructors.map(instructor => instructor.trim());
    timeslot.instructor = instructors.join(' & ');
    timeslot.instructors = instructors;
  }
});

jsonfile.writeFileSync('../coursesFixed.json', courses);
