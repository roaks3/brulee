const recipeService = require('../services/recipe.service');

const index = (req, res) => {
  recipeService.find(req.query.q)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  recipeService.findOne(req.params.id)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const create = (req, res) => {
  recipeService.create(req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const update = (req, res) => {
  recipeService.update(req.params.id, req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const destroy = (req, res) => {
  recipeService.deleteOne(req.params.id)
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
