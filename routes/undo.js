const userStore = require('../helpers/userStore');

exports.view = (req, res) => {
  if ('undo' in req.user) {
    req.user.courses = req.user.undo;
    delete req.user.undo;

    userStore.saveUser(req.user, () => {
      req.flash('info', req.params.message);
      res.redirect(`/${req.params.path}`);
    });
  } else {
    req.flash('info', 'Failed to undo action!');
    res.redirect(`/${req.params.path}`);
  }
};
