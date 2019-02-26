const mongoIngredientService = require('../services/mongo/ingredient.service');
const ingredientService = require('../services/ingredient.service');

const index = (req, res) => {
  mongoIngredientService.find(req.query.q)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  mongoIngredientService.findOne(req.params.id)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const create = (req, res) => {
  mongoIngredientService.create(req.body)
    .then(json =>
      ingredientService.create(json)
        .then(() => json))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const update = (req, res) => {
  mongoIngredientService.update(req.params.id, req.body)
    .then(json => {
      if (!req.body.name) {
        return json;
      }

      return ingredientService.updateName(req.params.id, req.body.name)
        .then(() => json);
    })
    .then(json => {
      if (!req.body.category_id) {
        return json;
      }

      return ingredientService.updateCategory(req.params.id, req.body.category_id)
        .then(() => json);
    })
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const destroy = (req, res) => {
  mongoIngredientService.deleteOne(req.params.id)
    .then(json =>
      ingredientService.deleteOne(req.params.id)
        .then(() => json))
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
