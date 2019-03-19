const _ = require('lodash');
const mongoIngredientService = require('../services/mongo/ingredient.service');
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
  const created = await mongoIngredientService.create(req.body);

  await ingredientService.create(created);

  return created;
};

const update = async req => {
  const updated = await mongoIngredientService.update(req.params.id, req.body);

  if (req.body.name) {
    await ingredientService.updateName(req.params.id, req.body.name);
  }

  if (req.body.category_id) {
    await ingredientService.updateCategory(req.params.id, req.body.category_id);
  }

  return updated;
};

const destroy = async req => {
  const deleted = await mongoIngredientService.deleteOne(req.params.id);

  await ingredientService.deleteOne(req.params.id);

  return deleted;
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
