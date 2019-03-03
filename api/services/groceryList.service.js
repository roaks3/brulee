const _ = require('lodash');
const moment = require('moment');
const { SQL } = require('sql-template-strings');
const pg = require('./pg.service');

const create = obj => {
  const fields = _.pick(obj, ['id', 'week_start']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create grocery_list');
  }

  if (fields.weekStart) {
    fields.weekStart = moment(fields.weekStart, 'YYYY-MM-DD').toDate();
  }

  return pg.pgQuery(
    pg.createSql('grocery_lists', fields)
  );
};

const update = (id, obj) => {
  const fields = _.pick(obj, ['week_start']);

  if (fields.weekStart) {
    fields.weekStart = moment(fields.weekStart, 'YYYY-MM-DD').toDate();
  }

  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to update grocery_list');
  }

  const query = pg.updateSql('grocery_lists', fields);

  query.append(SQL`
    where id = ${id}
  `);

  return pg.pgQuery(query);
};

const deleteOne = id =>
  pg.pgQuery(SQL`
    delete from grocery_lists
    where id = ${id}
  `);

const createGroceryListRecipe = obj => {
  const fields = _.pick(obj, ['grocery_list_id', 'recipe_id', 'day_of_week', 'scheduled_for']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create grocery_list_recipe');
  }

  return pg.pgQuery(
    pg.createSql('grocery_list_recipes', fields)
  );
};

const updateGroceryListRecipe = (groceryListId, recipeId, obj) => {
  const fields = _.pick(obj, ['day_of_week', 'scheduled_for']);

  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to update grocery_list_recipe');
  }

  const query = pg.updateSql('grocery_list_recipes', fields);

  query.append(SQL`
    where grocery_list_id = ${groceryListId} and recipe_id = ${recipeId}
  `);

  return pg.pgQuery(query);
};

const deleteOneGroceryListRecipe = (groceryListId, recipeId) =>
  pg.pgQuery(SQL`
    delete from grocery_list_recipes
    where grocery_list_id = ${groceryListId} and recipe_id = ${recipeId}
  `);

const createGroceryListIngredient = obj => {
  const fields = _.pick(obj, ['grocery_list_id', 'ingredient_id', 'amount', 'unit']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create grocery_list_ingredient');
  }

  return pg.pgQuery(
    pg.createSql('grocery_list_ingredients', fields)
  );
};

const updateGroceryListIngredient = (groceryListId, ingredientId, obj) => {
  const fields = _.pick(obj, ['amount', 'unit']);

  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to update grocery_list_ingredient');
  }

  const query = pg.updateSql('grocery_list_ingredients', fields);

  query.append(SQL`
    where grocery_list_id = ${groceryListId} and ingredient_id = ${ingredientId}
  `);

  return pg.pgQuery(query);
};

const deleteOneGroceryListIngredient = (groceryListId, ingredientId) =>
  pg.pgQuery(SQL`
    delete from grocery_list_ingredients
    where grocery_list_id = ${groceryListId} and ingredient_id = ${ingredientId}
  `);

module.exports = {
  create,
  update,
  deleteOne,
  createGroceryListRecipe,
  updateGroceryListRecipe,
  deleteOneGroceryListRecipe,
  createGroceryListIngredient,
  updateGroceryListIngredient,
  deleteOneGroceryListIngredient
};
