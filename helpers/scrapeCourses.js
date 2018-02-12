const request = require('request');
const cheerio = require('cheerio');
const async = require('async');
const jsonfile = require('jsonfile');

let $;
const classes = {};

const headers = {
  Referer: 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm',
  Origin: 'https://act.ucsd.edu',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
};

function isCourseHeader(elem) {
  return elem.html().indexOf('<span title="CAPE - Course and Professor Evaluations">Evaluations</span>') > -1;
}

function isTimeslot(elem) {
  return elem.hasClass('sectxt') || elem.hasClass('nonenrtxt');
}

function parseCourseHeader(elem) {
  const name = elem
    .children('td')
    .eq(2)
    .find('.boldtxt')
    .eq(0)
    .text()
    .trim();

  const code = elem
    .children('td')
    .eq(3)
    .find('.boldtxt')
    .eq(2)
    .attr('onclick')
    // eslint-disable-next-line no-script-url
    .replace('javascript:openNewWindow(\'http://cape.ucsd.edu/responses/Results.aspx?courseNumber=', '')
    .replace('+', ' ')
    .replace('\',\'CAPE\')', '');

  const department = code.split(' ')[0];
  const id = code.split(' ')[1];

  const currClass = {
    code,
    name,
    department,
    id,
  };
  currClass.timeslots = [];
  currClass.notes = [];

  return currClass;
}

function parseTimeslot(row) {
  const columns = [];

  row.children('td').each((i, td) => {
    if ($(td).attr('colspan') === undefined) {
      columns.push($(td).text().trim());
    } else {
      for (let j = 0; j < $(td).attr('colspan'); j += 1) {
        columns.push($(td).text().trim());
      }
    }
  });

  let instructors = [];
  instructors = columns[9].replace(/\\t/g, '').split('\\n').filter(n => n.replace(/\s/g, '').length > 1);

  return {
    sectxt: row.hasClass('sectxt'),
    sectionID: columns[2],
    type: columns[3],
    section: columns[4],
    days: columns[5],
    time: columns[6],
    building: columns[7],
    room: columns[8],
    instructors,
  };
}

function processPage(page, callback) {
  console.log(`Processing page ${page}`);
  const options = {
    url: `https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm?page=${page}`,
    method: 'GET',
    headers,
    jar: true,
  };


  let currClass = null;

  request.post(options, (error, response, res) => {
    $ = cheerio.load(res);

    $('.tbrdr tr').each((i, row) => {
      if (isCourseHeader($(row))) {
        currClass = parseCourseHeader($(row));
        classes[currClass.code] = currClass;
      } else if (currClass != null && isTimeslot($(row))) {
        const timeslot = parseTimeslot($(row));

        if (timeslot.type.length === 2) {
          currClass.timeslots.push(timeslot);
        } else {
          const note = $(row)
            .text()
            .trim();

          console.log(`Failed to parse the following timeslot from ${currClass.code}: ${note}`);
          currClass.notes.push(note);
        }
      }
    });
    callback();
  });
}

function updateCourses(term) {
  const body = `selectedTerm=${term}&xsoc_term=&loggedIn=false&tabNum=tabs-dept&_selectedSubjects=1&schedOption1=true&_schedOption1=on&_schedOption11=on&_schedOption12=on&schedOption2=true&_schedOption2=on&_schedOption4=on&_schedOption5=on&_schedOption3=on&_schedOption7=on&_schedOption8=on&_schedOption13=on&_schedOption10=on&_schedOption9=on&schDay=M&_schDay=on&schDay=T&_schDay=on&schDay=W&_schDay=on&schDay=R&_schDay=on&schDay=F&_schDay=on&schDay=S&_schDay=on&schStartTime=12%3A00&schStartAmPm=0&schEndTime=12%3A00&schEndAmPm=0&selectedDepartments=AIP+&selectedDepartments=AWP+&selectedDepartments=ANES&selectedDepartments=ANTH&selectedDepartments=AUDL&selectedDepartments=BENG&selectedDepartments=BIOL&selectedDepartments=BIOM&selectedDepartments=CMM+&selectedDepartments=CHEM&selectedDepartments=CHIN&selectedDepartments=CLRE&selectedDepartments=CLPH&selectedDepartments=CLIN&selectedDepartments=COGS&selectedDepartments=COMM&selectedDepartments=CSE+&selectedDepartments=ICAM&selectedDepartments=CONT&selectedDepartments=CGS+&selectedDepartments=CAT+&selectedDepartments=DSC+&selectedDepartments=DERM&selectedDepartments=DOC+&selectedDepartments=ECON&selectedDepartments=EDS+&selectedDepartments=ERC+&selectedDepartments=ECE+&selectedDepartments=EMED&selectedDepartments=ENVR&selectedDepartments=ESYS&selectedDepartments=ETHN&selectedDepartments=FMPH&selectedDepartments=FPM+&selectedDepartments=FILM&selectedDepartments=GMST&selectedDepartments=GLBH&selectedDepartments=GPS+&selectedDepartments=HLAW&selectedDepartments=HIST&selectedDepartments=HDP+&selectedDepartments=HMNR&selectedDepartments=HUM+&selectedDepartments=INTL&selectedDepartments=JAPN&selectedDepartments=JUDA&selectedDepartments=LATI&selectedDepartments=LHCO&selectedDepartments=LING&selectedDepartments=LIT+&selectedDepartments=MMW+&selectedDepartments=MBC+&selectedDepartments=MATS&selectedDepartments=MSED&selectedDepartments=MATH&selectedDepartments=MAE+&selectedDepartments=MED+&selectedDepartments=MUIR&selectedDepartments=MCWP&selectedDepartments=MUS+&selectedDepartments=NENG&selectedDepartments=NEU+&selectedDepartments=OPTH&selectedDepartments=ORTH&selectedDepartments=PATH&selectedDepartments=PEDS&selectedDepartments=PHAR&selectedDepartments=PHIL&selectedDepartments=PHYS&selectedDepartments=POLI&selectedDepartments=PSY+&selectedDepartments=PSYC&selectedDepartments=RMAS&selectedDepartments=RAD+&selectedDepartments=RSM+&selectedDepartments=RELI&selectedDepartments=RMED&selectedDepartments=REV+&selectedDepartments=SOMI&selectedDepartments=SOE+&selectedDepartments=SOMC&selectedDepartments=SIO+&selectedDepartments=SOC+&selectedDepartments=SE++&selectedDepartments=SURG&selectedDepartments=THEA&selectedDepartments=TWS+&selectedDepartments=TMC+&selectedDepartments=UNAF&selectedDepartments=USP+&selectedDepartments=VIS+&selectedDepartments=WARR&selectedDepartments=WCWP&selectedDepartments=WES+&_selectedDepartments=1&schedOption1Dept=true&_schedOption1Dept=on&schedOption11Dept=true&_schedOption11Dept=on&schedOption12Dept=true&_schedOption12Dept=on&schedOption2Dept=true&_schedOption2Dept=on&schedOption4Dept=true&_schedOption4Dept=on&schedOption5Dept=true&_schedOption5Dept=on&schedOption3Dept=true&_schedOption3Dept=on&schedOption7Dept=true&_schedOption7Dept=on&schedOption8Dept=true&_schedOption8Dept=on&schedOption13Dept=true&_schedOption13Dept=on&schedOption10Dept=true&_schedOption10Dept=on&schedOption9Dept=true&_schedOption9Dept=on&schDayDept=M&_schDayDept=on&schDayDept=T&_schDayDept=on&schDayDept=W&_schDayDept=on&schDayDept=R&_schDayDept=on&schDayDept=F&_schDayDept=on&schDayDept=S&_schDayDept=on&schStartTimeDept=12%3A00&schStartAmPmDept=0&schEndTimeDept=12%3A00&schEndAmPmDept=0&courses=&sections=&instructorType=begin&instructor=&titleType=contain&title=&_hideFullSec=on&_showPopup=on`;

  const options = {
    url: 'https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm?page=1',
    method: 'POST',
    headers,
    body,
    jar: true,
  };

  let lastPage = 1;
  let pages = [];

  request.post(options, (error, response, res) => {
    $ = cheerio.load(res);

    lastPage = parseInt($('a:contains("Last")').attr('href').split('?')[1].substring(5), 10);
    pages = Array(lastPage).fill().map((e, i) => i + 1);

    async.eachLimit(pages, 10, processPage, (err) => {
      if (err) {
        console.log(err);
      } else {
        jsonfile.writeFileSync('./data/courses.json', classes);
        console.log('Courses saved!');
      }
    });
  });
}

updateCourses('WI18');

module.exports = { updateCourses };
