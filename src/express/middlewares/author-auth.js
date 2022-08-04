'use strict';

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (!user && !user.isAdmin) {
    res.redirect(`/`);
  }

  next();
};
