const _ = require('lodash');
const pg = require('./pg.service');

const find = ({ ids }) => {
  const query = pg.knex('recipes').select();

  if (ids) {
    query.whereIn('id', ids);
  }

  return query;
};

const create = async obj => {
  const fields = _.pick(obj, ['name', 'original_text', 'url']);

  const [result] = await pg
    .knex('recipes')
    .insert(fields)
    .returning('*');

  return result || {};
};

const update = async (id, obj) => {
  const fields = _.pick(obj, [
    'name',
    'url',
    'tags',
    'prepare_time_in_minutes',
    'cook_time_in_minutes',
    'original_text',
    'instructions',
    'modifications',
    'nutrition_facts'
  ]);

  fields.prepare_time_in_minutes = fields.prepare_time_in_minutes || undefined;
  fields.cook_time_in_minutes = fields.cook_time_in_minutes || undefined;

  const [result] = await pg
    .knex('recipes')
    .update(fields)
    .where({ id })
    .returning('*');

  return result || {};
};

const deleteOne = id =>
  pg
    .knex('recipes')
    .del()
    .where({ id })
    .return({ id });

const findRecipeIngredients = ({ recipeIds }) => {
  const query = pg.knex('recipe_ingredients').select();

  if (recipeIds) {
    query.whereIn('recipe_id', recipeIds);
  }

  return query;
};

const createRecipeIngredient = async obj => {
  const fields = _.pick(obj, ['recipe_id', 'ingredient_id', 'amount', 'unit']);

  const [result] = await pg
    .knex('recipe_ingredients')
    .insert(fields)
    .returning('*');

  return result || {};
};

const updateRecipeIngredient = async (recipeId, ingredientId, obj) => {
  const fields = _.pick(obj, ['amount', 'unit']);

  const [result] = await pg
    .knex('recipe_ingredients')
    .update(fields)
    .where({ recipe_id: recipeId, ingredient_id: ingredientId })
    .returning('*');

  return result || {};
};

const deleteOneRecipeIngredient = (recipeId, ingredientId) =>
  pg
    .knex('recipe_ingredients')
    .del()
    .where({ recipe_id: recipeId, ingredient_id: ingredientId });

const deleteRecipeIngredientsForRecipe = recipeId =>
  pg
    .knex('recipe_ingredients')
    .del()
    .where({ recipe_id: recipeId });

module.exports = {
  find,
  create,
  update,
  deleteOne,
  findRecipeIngredients,
  createRecipeIngredient,
  updateRecipeIngredient,
  deleteOneRecipeIngredient,
  deleteRecipeIngredientsForRecipe
};
