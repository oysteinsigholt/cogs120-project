exports.view = (req, res) => {
  res.render('index', { user: req.user });
};
