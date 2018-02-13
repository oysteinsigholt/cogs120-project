const userStore = require('../helpers/userStore');

exports.view = (req, res) => {
  res.render('index', { user: req.user });
};

exports.post = (req, res) => {
  if (req.body.chip instanceof Array) {
    req.user.courses = req.body.chip;
  } else if (req.body.chip.length > 0) {
    req.user.courses = [req.body.chip];
  } else {
    req.user.courses = [];
  }

  userStore.saveUser(req.user, () => {
    res.render('index', { user: req.user });
  });
};
