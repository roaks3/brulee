const _ = require('lodash');
const moment = require('moment');
const pg = require('./pg.service');

const find = ({ ids, sortMostRecent, limit }) => {
  const query = pg.knex('grocery_lists').select();

  if (ids) {
    query.whereIn('id', ids);
  }

  if (sortMostRecent) {
    query.orderBy('week_start', 'desc');
  }

  if (limit) {
    query.limit(limit);
  }

  return query;
};

const create = async obj => {
  const [result] = await pg
    .knex('grocery_lists')
    .insert({
      week_start: moment(obj.week_start, 'YYYY-MM-DD').toDate()
    })
    .returning('*');

  return result || {};
};

const update = async (id, obj) => {
  const [result] = await pg
    .knex('grocery_lists')
    .update({
      week_start: moment(obj.week_start, 'YYYY-MM-DD').toDate()
    })
    .where({ id })
    .returning('*');

  return result || {};
};

const deleteOne = id =>
  pg
    .knex('grocery_lists')
    .del()
    .where({ id })
    .return({ id });

const findGroceryListRecipes = ({ groceryListIds }) => {
  const query = pg.knex('grocery_list_recipes').select();

  if (groceryListIds) {
    query.whereIn('grocery_list_id', groceryListIds);
  }

  return query;
};

const createGroceryListRecipe = async obj => {
  const fields = _.pick(obj, [
    'grocery_list_id',
    'recipe_id',
    'day_of_week',
    'scheduled_for'
  ]);

  const [result] = await pg
    .knex('grocery_list_recipes')
    .insert(fields)
    .returning('*');

  return result || {};
};

const deleteOneGroceryListRecipe = (groceryListId, recipeId, dayOfWeek) =>
  pg
    .knex('grocery_list_recipes')
    .del()
    .where({
      grocery_list_id: groceryListId,
      recipe_id: recipeId,
      day_of_week: dayOfWeek
    });

const deleteGroceryListRecipesForGroceryList = groceryListId =>
  pg
    .knex('grocery_list_recipes')
    .del()
    .where({ grocery_list_id: groceryListId });

const findGroceryListIngredients = ({ groceryListIds }) => {
  const query = pg.knex('grocery_list_ingredients').select();

  if (groceryListIds) {
    query.whereIn('grocery_list_id', groceryListIds);
  }

  return query;
};

const createGroceryListIngredient = async obj => {
  const fields = _.pick(obj, [
    'grocery_list_id',
    'ingredient_id',
    'amount',
    'unit'
  ]);

  const [result] = await pg
    .knex('grocery_list_ingredients')
    .insert(fields)
    .returning('*');

  return result || {};
};

const updateGroceryListIngredient = async (
  groceryListId,
  ingredientId,
  obj
) => {
  const fields = _.pick(obj, ['amount', 'unit']);

  const [result] = await pg
    .knex('grocery_list_ingredients')
    .update(fields)
    .where({
      grocery_list_id: groceryListId,
      ingredient_id: ingredientId
    })
    .returning('*');

  return result || {};
};

const deleteGroceryListIngredients = ({ groceryListId, ingredientId }) =>
  pg
    .knex('grocery_list_ingredients')
    .del()
    .where(
      _.pickBy(
        {
          grocery_list_id: groceryListId,
          ingredient_id: ingredientId
        },
        Boolean
      )
    );

module.exports = {
  find,
  create,
  update,
  deleteOne,
  findGroceryListRecipes,
  createGroceryListRecipe,
  deleteOneGroceryListRecipe,
  deleteGroceryListRecipesForGroceryList,
  findGroceryListIngredients,
  createGroceryListIngredient,
  updateGroceryListIngredient,
  deleteGroceryListIngredients
};
