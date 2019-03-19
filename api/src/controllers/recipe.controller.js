const _ = require('lodash');
const mongoRecipeService = require('../services/mongo/recipe.service');
const recipeService = require('../services/recipe.service');
const recipeSerializer = require('../serializers/recipe.serializer');

const index = async req => {
  const recipes = await recipeService.find({
    ids: _.isString(req.query.ids) ? [req.query.ids] : req.query.ids
  });

  return Promise.all(
    recipes.map(async recipe => {
      const recipeIngredients = await recipeService.findRecipeIngredients({
        recipeIds: [recipe.id]
      });
      return recipeSerializer.serialize(recipe, recipeIngredients);
    })
  );
};

const show = async req => {
  const recipes = await recipeService.find({ ids: [req.params.id] });
  const recipeIngredients = await recipeService.findRecipeIngredients({
    recipeIds: [req.params.id]
  });

  return recipes && recipes.length
    ? recipeSerializer.serialize(recipes[0], recipeIngredients)
    : {};
};

const createRecipeIngredient = (recipeId, recipeIngredient) =>
  recipeService.createRecipeIngredient(
    Object.assign({}, recipeIngredient, { recipe_id: recipeId })
  );

const create = async req => {
  const created = await mongoRecipeService.create(req.body);

  await recipeService.create(created);
  await Promise.all(
    (req.body.recipe_ingredients || []).map(recipeIngredient =>
      createRecipeIngredient(created.id, recipeIngredient)
    )
  );

  return created;
};

const updateRecipeIngredientsForRecipe = (oldRecipe, newRecipe) => {
  const createdRecipeIngredients = (newRecipe.recipe_ingredients || []).filter(
    nri =>
      !(oldRecipe.recipe_ingredients || []).find(
        ori => ori.ingredient_id === nri.ingredient_id
      )
  );
  const removedRecipeIngredients = (oldRecipe.recipe_ingredients || []).filter(
    ori =>
      !(newRecipe.recipe_ingredients || []).find(
        nri => nri.ingredient_id === ori.ingredient_id
      )
  );
  const changedRecipeIngredients = (newRecipe.recipe_ingredients || []).filter(
    nri =>
      (oldRecipe.recipe_ingredients || []).find(
        ori =>
          ori.ingredient_id === nri.ingredient_id &&
          (ori.amount !== nri.amount || ori.unit !== nri.unit)
      )
  );

  return Promise.all([
    ...createdRecipeIngredients.map(ri =>
      createRecipeIngredient(oldRecipe.id, ri)
    ),
    ...removedRecipeIngredients.map(ri =>
      recipeService.deleteOneRecipeIngredient(oldRecipe.id, ri.ingredient_id)
    ),
    ...changedRecipeIngredients.map(ri =>
      recipeService.updateRecipeIngredient(oldRecipe.id, ri.ingredient_id, ri)
    )
  ]);
};

const update = async req => {
  const original = await mongoRecipeService.findOne(req.params.id);
  const updated = await mongoRecipeService.update(req.params.id, req.body);

  await recipeService.update(req.params.id, req.body);
  await updateRecipeIngredientsForRecipe(original, req.body);

  return updated;
};

const destroy = async req => {
  const deleted = await mongoRecipeService.deleteOne(req.params.id);

  await recipeService.deleteRecipeIngredientsForRecipe(req.params.id);
  await recipeService.deleteOne(req.params.id);

  return deleted;
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
