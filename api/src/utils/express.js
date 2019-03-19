const toExpress = requestHandler => async (req, res, next) => {
  try {
    res.send(await requestHandler(req));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  toExpress
};
