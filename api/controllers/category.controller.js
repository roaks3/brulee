const categoryService = require('../services/category.service');

const index = (req, res) => {
  categoryService.find(req.query.q)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  categoryService.findOne(req.params.id)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const create = (req, res) => {
  categoryService.create(req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const update = (req, res) => {
  categoryService.update(req.params.id, req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const destroy = (req, res) => {
  categoryService.deleteOne(req.params.id)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
