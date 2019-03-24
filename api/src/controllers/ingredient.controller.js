const _ = require('lodash');
const ingredientService = require('../services/ingredient.service');
const ingredientSerializer = require('../serializers/ingredient.serializer');

const index = async req => {
  const ingredients = await ingredientService.find({
    ids: _.isString(req.query.ids) ? [req.query.ids] : req.query.ids,
    names: _.isString(req.query.names) ? [req.query.names] : req.query.names
  });

  return ingredients.map(ingredientSerializer.serialize);
};

const show = async req => {
  const ingredients = await ingredientService.find({ ids: [req.params.id] });

  return ingredients && ingredients.length
    ? ingredientSerializer.serialize(ingredients[0])
    : {};
};

const create = async req => {
  const created = await ingredientService.create(req.body);

  return ingredientSerializer.serialize(created);
};

const update = async req => {
  const updated = await ingredientService.update(req.params.id, req.body);

  return ingredientSerializer.serialize(updated);
};

const destroy = async req => {
  const deleted = await ingredientService.deleteOne(req.params.id);

  return ingredientSerializer.serialize(deleted);
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
