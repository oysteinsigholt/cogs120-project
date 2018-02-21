const jsonfile = require('jsonfile');
const path = require('path');
const resolvePath = require('resolve-path');

exports.view = (req, res) => {
  let userFile = null;
  try {
    userFile = resolvePath(path.resolve(__dirname, '..', 'data', 'users'), `${req.params.id}.json`);
  } catch (err) {
    console.log(err);
    res.status(500).send(':(');
    return;
  }

  jsonfile.readFile(userFile, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send(':(');
      return;
    }
    for (let i = 0; i < Object.keys(user.courses).length; i += 1) {
      let courseFile = null;
      try {
        courseFile = resolvePath(path.resolve(__dirname, '..', 'data', 'courses'), `W18/${Object.keys(user.courses)[i]}.json`);
      } catch (err2) {
        console.log(err2);
        res.status(500).send(':(');
        return;
      }
      console.log(courseFile);
    }
  });
};
