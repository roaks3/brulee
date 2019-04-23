const _ = require('lodash');
const groceryListService = require('../services/groceryList.service');
const ingredientService = require('../services/ingredient.service');
const ingredientSerializer = require('../serializers/ingredient.serializer');
const recipeService = require('../services/recipe.service');

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
  if (req.body.name) {
    const ingredientsWithSameName = await ingredientService.find({
      names: [req.body.name]
    });
    if (ingredientsWithSameName.some(i => i.id !== req.params.id)) {
      throw new Error('This ingredient name already exists');
    }
  }

  const updated = await ingredientService.update(req.params.id, req.body);

  return ingredientSerializer.serialize(updated);
};

const destroy = async req => {
  const associatedRecipes = await recipeService.find({
    ingredientId: req.params.id
  });
  if (associatedRecipes.length) {
    throw new Error(
      `Cannot delete because ingredient is being used in recipes: [${associatedRecipes
        .map(r => r.name)
        .join(', ')}]`
    );
  }

  // Eliminate orphaned references in grocery lists without requiring the user to do so manually
  await groceryListService.deleteGroceryListIngredients({
    ingredientId: req.params.id
  });

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
