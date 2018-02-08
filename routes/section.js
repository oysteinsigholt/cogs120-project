exports.view = (req, res) => {
  res.render('section', {
    name: 'Interaction Design',
    code: 'CSE 170',
    days: [{
      name: 'Monday',
      short: 'M',
    },
    {
      name: 'Tuesday',
      short: 'Tu',
    },
    {
      name: 'Wednestay',
      short: 'W',
    },
    {
      name: 'Thursday',
      short: 'Th',
    },
    {
      name: 'Friday',
      short: 'F',
    },
    {
      name: 'Saturday',
      short: 'Sa',
    },
    {
      name: 'Sunday',
      short: 'Su',
    }],
    timeslots: [{
      sectionID: 0,
      type: 'LE',
      section: 'A00',
      days: 'TuTh',
      time: '9:30a-10:50a',
      building: 'CICC',
      room: '101',
      instructor: 'Klemmer, Scott R',
    },
    {
      sectionID: 0,
      type: 'LE',
      section: 'A00',
      days: 'TuF',
      time: '10:30p-12:50p',
      building: 'CICC',
      room: '102',
      instructor: 'The Dude',
    }],
  });
};
