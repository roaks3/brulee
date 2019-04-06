const _ = require('lodash');
const recipeService = require('../services/recipe.service');
const recipeSerializer = require('../serializers/recipe.serializer');

const index = async req => {
  const recipes = await recipeService.find({
    ids: _.isString(req.query.ids) ? [req.query.ids] : req.query.ids,
    includeUseCounts: req.query.includeUseCounts
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
  recipeService.createRecipeIngredient({
    ...recipeIngredient,
    recipe_id: recipeId
  });

const create = async req => {
  const created = await recipeService.create(req.body);

  const createdRecipeIngredients = await Promise.all(
    (req.body.recipe_ingredients || []).map(recipeIngredient =>
      createRecipeIngredient(created.id, recipeIngredient)
    )
  );

  return recipeSerializer.serialize(created, createdRecipeIngredients);
};

const updateRecipeIngredientsForRecipe = (
  recipeId,
  oldRecipeIngredients,
  newRecipeIngredients
) => {
  const createdRecipeIngredients = (newRecipeIngredients || []).filter(
    nri =>
      !(oldRecipeIngredients || []).find(
        ori => ori.ingredient_id === nri.ingredient_id
      )
  );
  const removedRecipeIngredients = (oldRecipeIngredients || []).filter(
    ori =>
      !(newRecipeIngredients || []).find(
        nri => nri.ingredient_id === ori.ingredient_id
      )
  );
  const changedRecipeIngredients = (newRecipeIngredients || []).filter(nri =>
    (oldRecipeIngredients || []).find(
      ori =>
        ori.ingredient_id === nri.ingredient_id &&
        (ori.amount !== nri.amount || ori.unit !== nri.unit)
    )
  );

  return Promise.all([
    ...createdRecipeIngredients.map(ri => createRecipeIngredient(recipeId, ri)),
    ...removedRecipeIngredients.map(ri =>
      recipeService.deleteOneRecipeIngredient(recipeId, ri.ingredient_id)
    ),
    ...changedRecipeIngredients.map(ri =>
      recipeService.updateRecipeIngredient(recipeId, ri.ingredient_id, ri)
    )
  ]);
};

const update = async req => {
  const updated = await recipeService.update(req.params.id, req.body);
  const originalRecipeIngredients = await recipeService.findRecipeIngredients({
    recipeIds: [req.params.id]
  });

  await updateRecipeIngredientsForRecipe(
    req.params.id,
    originalRecipeIngredients,
    req.body.recipe_ingredients
  );

  const updatedRecipeIngredients = await recipeService.findRecipeIngredients({
    recipeIds: [req.params.id]
  });

  return recipeSerializer.serialize(updated, updatedRecipeIngredients);
};

const destroy = async req => {
  await recipeService.deleteRecipeIngredientsForRecipe(req.params.id);

  const deleted = await recipeService.deleteOne(req.params.id);

  return recipeSerializer.serialize(deleted, []);
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
