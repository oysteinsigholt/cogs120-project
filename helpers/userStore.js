const jsonfile = require('jsonfile');
const path = require('path');

function saveUser(user, done) {
  jsonfile.writeFile(path.resolve(__dirname, '..', 'data', 'users', `${user.id}.json`), user, (err) => {
    if (err) console.log(err);
    done(err);
  });
}

module.exports = { saveUser };
