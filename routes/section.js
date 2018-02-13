const path = require('path');
const resolvePath = require('resolve-path');
const jsonfile = require('jsonfile');


exports.view = (req, res) => {
  let courseFile = null;

  try {
    courseFile = resolvePath(path.resolve(__dirname, '..', 'data', 'courses'), `${req.params.quarter}/${req.params.course}.json`);
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

    res.render('section', { course });
  });

  /* res.render('section', {
    name: 'Interaction Design',
    code: 'CSE 170',
    days: [{
      name: 'Tuesday',
      events: [{
        type: 'Lecture',
        section: 'A00',
        time: '9:30a-10:50a',
        building: 'CICC',
        room: '101',
        instructor: 'Klemmer, Scott R',
        checked: true,
      }],
    },
    {
      name: 'Thursday',
      events: [{
        type: 'Lecture',
        section: 'A00',
        time: '9:30a-10:50a',
        building: 'CICC',
        room: '101',
        instructor: 'Klemmer, Scott R',
        checked: true,
      }],
    },
    {
      name: 'Friday',
      events: [{
        type: 'Studio',
        section: 'A01',
        time: '11:30a-12:40p',
        building: 'CSB',
        room: '272',
        instructor: 'Mysore, Alok',
      },
      {
        type: 'Studio',
        section: 'A01',
        time: '12:50p-2:00p',
        building: 'CSB',
        room: '272',
        instructor: 'Mysore, Alok',
      }],
    }],
  }); */
};
