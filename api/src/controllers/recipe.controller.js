const _ = require('lodash');
const mongoRecipeService = require('../services/mongo/recipe.service');
const recipeService = require('../services/recipe.service');
const recipeSerializer = require('../serializers/recipe.serializer');

const index = (req, res) => {
  recipeService.find({ ids: _.isString(req.query.ids) ? [ req.query.ids ] : req.query.ids })
    .then(json =>
      Promise.all(
        json.map(recipe =>
          recipeService.findRecipeIngredients({ recipeIds: [recipe.id] })
            .then(recipeIngredients => recipeSerializer.serialize(recipe, recipeIngredients)))))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  recipeService.find({ ids: [req.params.id] })
    .then(json =>
      recipeService.findRecipeIngredients({ recipeIds: [req.params.id] })
        .then(recipeIngredients => [ json, recipeIngredients ]))
    .then(([ json, recipeIngredients ]) =>
      (json && json.length) ? recipeSerializer.serialize(json[0], recipeIngredients) : {})
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const createRecipeIngredient = (recipeId, recipeIngredient) =>
  recipeService.createRecipeIngredient(Object.assign({}, recipeIngredient, { recipe_id: recipeId }));

const create = (req, res) => {
  mongoRecipeService.create(req.body)
    .then(json =>
      recipeService.create(json)
        .then(() => json))
    .then(json =>
      Promise
        .all(
          (req.body.recipe_ingredients || []).map(ri =>
            createRecipeIngredient(json.id, ri)))
        .then(() => json))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const updateRecipeIngredientsForRecipe = (oldRecipe, newRecipe) => {
  const createdRecipeIngredients = (newRecipe.recipe_ingredients || [])
    .filter(nri =>
      !(oldRecipe.recipe_ingredients || []).find(ori => ori.ingredient_id === nri.ingredient_id));
  const removedRecipeIngredients = (oldRecipe.recipe_ingredients || [])
    .filter(ori =>
      !(newRecipe.recipe_ingredients || []).find(nri => nri.ingredient_id === ori.ingredient_id));
  const changedRecipeIngredients = (newRecipe.recipe_ingredients || [])
    .filter(nri =>
      (oldRecipe.recipe_ingredients || []).find(ori =>
        ori.ingredient_id === nri.ingredient_id && (ori.amount !== nri.amount || ori.unit !== nri.unit)));

  return Promise.all([
    ...createdRecipeIngredients.map(ri =>
      createRecipeIngredient(oldRecipe.id, ri)),
    ...removedRecipeIngredients.map(ri =>
      recipeService.deleteOneRecipeIngredient(oldRecipe.id, ri.ingredient_id)),
    ...changedRecipeIngredients.map(ri =>
      recipeService.updateRecipeIngredient(oldRecipe.id, ri.ingredient_id, ri))]);
};

const update = (req, res) => {
  let original;
  mongoRecipeService.findOne(req.params.id)
    .then(json => {
      original = json;
    })
    .then(() => mongoRecipeService.update(req.params.id, req.body))
    .then(json =>
      recipeService.update(req.params.id, req.body)
        .then(() => json))
    .then(json =>
      updateRecipeIngredientsForRecipe(original, req.body)
        .then(() => json))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const destroy = (req, res) => {
  mongoRecipeService.deleteOne(req.params.id)
    .then(json =>
      recipeService.deleteRecipeIngredientsForRecipe(req.params.id)
        .then(() => json))
    .then(json =>
      recipeService.deleteOne(req.params.id)
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
