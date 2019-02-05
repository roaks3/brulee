const ingredientService = require('../services/ingredient.service');

const index = (req, res) => {
  ingredientService.find(req.query.q)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  ingredientService.findOne(req.params.id)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const create = (req, res) => {
  ingredientService.create(req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const update = (req, res) => {
  ingredientService.update(req.params.id, req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const destroy = (req, res) => {
  ingredientService.deleteOne(req.params.id)
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
