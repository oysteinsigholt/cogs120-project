const data = require('../data/help.json');

exports.view = (req, res) => {
  res.render('help', { data });
};
