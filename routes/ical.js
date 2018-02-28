const jsonfile = require('jsonfile');
const path = require('path');
const resolvePath = require('resolve-path');
const icalToolkit = require('ical-toolkit');

function sendBlankFile(res) {
  const builder = icalToolkit.createIcsFileBuilder();
  builder.calname = 'UCSD Plan';
  builder.timezone = 'America/Los_Angeles';
  builder.tzid = 'America/Los_Angeles';
  builder.method = 'PUBLISH';

  const icsFileContent = builder.toString();
  if (icsFileContent instanceof Error) {
    console.log('ical failed!');
  }
  res.set({
    'Content-Type': 'text/calendar',
    'Content-disposition': 'attachment; filename=calendar.ics',
  });

  res.send(icsFileContent.replace(/UNTIL=;TZID=America\/Los_Angeles:/g, 'UNTIL='));
}

exports.view = (req, res) => {
  const builder = icalToolkit.createIcsFileBuilder();
  builder.calname = 'UCSD Plan';
  builder.timezone = 'America/Los_Angeles';
  builder.tzid = 'America/Los_Angeles';
  builder.method = 'PUBLISH';

  let userFile = null;
  try {
    userFile = resolvePath(path.resolve(__dirname, '..', 'data', 'users'), `${req.params.id}.json`);
  } catch (err) {
    console.log(err);
    sendBlankFile(res);
    return;
  }

  jsonfile.readFile(userFile, (err, user) => {
    if (err || !('courses' in user) || user.courses.length < 1) {
      if (err) console.log(err);
      sendBlankFile(res);
      return;
    }

    for (let i = 0; i < Object.keys(user.courses).length; i += 1) {
      let courseFile = null;
      try {
        courseFile = resolvePath(path.resolve(__dirname, '..', 'data', 'courses'), `W18/${Object.keys(user.courses)[i]}.json`);
      } catch (err2) {
        console.log(err2);
        sendBlankFile(res);
        return;
      }
      user.courses[Object.keys(user.courses)[i]].data = jsonfile.readFileSync(courseFile);
      const course = Object.keys(user.courses)[i];

      for (let j = 0; j < Object.keys(user.courses[course].data.events_repeating).length; j += 1) {
        const day = Object.keys(user.courses[course].data.events_repeating)[j];
        for (let k = 0; k < Object.keys(user.courses[course].data.events_repeating[day]).length; k += 1) {
          const event = Object.keys(user.courses[course].data.events_repeating[day])[k];
          const event_data = user.courses[course].data.events_repeating[day][event];

          if (event in user.courses[course].timeslots) {
            const startSemester = new Date('Mon Jan 08 2018 00:00:00 GMT-0800 (Pacific Standard Time)');
            const distance = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'].indexOf(day) - startSemester.getDay();
            const startDay = new Date(startSemester.valueOf());
            startDay.setDate(startDay.getDate() + distance);

            const start = new Date(startDay.valueOf());
            start.setHours(event_data.start_time.split(':')[0], event_data.start_time.split(':')[1]);

            const end = new Date(startDay.valueOf());
            end.setHours(event_data.end_time.split(':')[0], event_data.end_time.split(':')[1]);

            builder.events.push({
              start,
              end,
              transp: 'OPAQUE',
              summary: `${course} ${event_data.type}`,
              repeating: {
                freq: 'WEEKLY',
                until: new Date('Fri Mar 16 2018 23:59:59 GMT-0700 (Pacific Summer Time)'),
              },
              location: `${event_data.building} ${event_data.room}`,
              description: `${event_data.instructors.join(', ')}`,
              method: 'PUBLISH',
              status: 'CONFIRMED',
            });
          }
        }
      }
    }

    const icsFileContent = builder.toString();
    if (icsFileContent instanceof Error) {
      console.log('ical failed!');
    }
    res.set({
      'Content-Type': 'text/calendar',
      'Content-disposition': 'attachment; filename=calendar.ics',
    });

    res.send(icsFileContent.replace(/UNTIL=;TZID=America\/Los_Angeles:/g, 'UNTIL='));
  });
};
