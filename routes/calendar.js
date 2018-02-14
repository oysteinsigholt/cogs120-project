exports.view = (req, res) => {
  res.render('calendar', { user: req.user });
};
