const _ = require('lodash');
const moment = require('moment');
const { SQL } = require('sql-template-strings');
const pg = require('./pg.service');

const find = ({ ids, sortMostRecent, limit }) => {
  const query = SQL`
    select *
    from grocery_lists
  `;

  if (ids) {
    query.append(SQL`
      where id = any(${ids})
    `);
  }

  if (sortMostRecent) {
    query.append(SQL`
      order by week_start desc
    `);
  }

  if (limit) {
    query.append(SQL`
      limit ${limit}
    `);
  }

  return pg.pgQuery(query);
};

const create = async obj => {
  const fields = _.pick(obj, ['week_start']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create grocery_list');
  }

  if (fields.weekStart) {
    fields.weekStart = moment(fields.weekStart, 'YYYY-MM-DD').toDate();
  }

  const result = await pg.pgQuery(pg.createSql('grocery_lists', fields));

  return result && result.length ? result[0] : {};
};

const update = async (id, obj) => {
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
    returning *
  `);

  const result = await pg.pgQuery(query);

  return result && result.length ? result[0] : {};
};

const deleteOne = async id => {
  const result = await pg.pgQuery(SQL`
    delete from grocery_lists
    where id = ${id}
    returning *
  `);

  return result && result.length ? result[0] : {};
};

const findGroceryListRecipes = ({ groceryListIds }) => {
  const query = SQL`
    select *
    from grocery_list_recipes
  `;

  if (groceryListIds) {
    query.append(SQL`
      where grocery_list_id = any(${groceryListIds})
    `);
  }

  return pg.pgQuery(query);
};

const createGroceryListRecipe = async obj => {
  const fields = _.pick(obj, [
    'grocery_list_id',
    'recipe_id',
    'day_of_week',
    'scheduled_for'
  ]);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create grocery_list_recipe');
  }

  const result = await pg.pgQuery(pg.createSql('grocery_list_recipes', fields));

  return result && result.length ? result[0] : {};
};

const deleteOneGroceryListRecipe = (groceryListId, recipeId, dayOfWeek) =>
  pg.pgQuery(SQL`
    delete from grocery_list_recipes
    where grocery_list_id = ${groceryListId} and recipe_id = ${recipeId} and day_of_week = ${dayOfWeek}
  `);

const deleteGroceryListRecipesForGroceryList = groceryListId =>
  pg.pgQuery(SQL`
    delete from grocery_list_recipes
    where grocery_list_id = ${groceryListId}
  `);

const findGroceryListIngredients = ({ groceryListIds }) => {
  const query = SQL`
    select *
    from grocery_list_ingredients
  `;

  if (groceryListIds) {
    query.append(SQL`
      where grocery_list_id = any(${groceryListIds})
    `);
  }

  return pg.pgQuery(query);
};

const createGroceryListIngredient = async obj => {
  const fields = _.pick(obj, [
    'grocery_list_id',
    'ingredient_id',
    'amount',
    'unit'
  ]);
  if (_.isEmpty(fields)) {
    throw new Error(
      'No valid fields provided to create grocery_list_ingredient'
    );
  }

  const result = await pg.pgQuery(
    pg.createSql('grocery_list_ingredients', fields)
  );

  return result && result.length ? result[0] : {};
};

const updateGroceryListIngredient = (groceryListId, ingredientId, obj) => {
  const fields = _.pick(obj, ['amount', 'unit']);

  if (_.isEmpty(fields)) {
    throw new Error(
      'No valid fields provided to update grocery_list_ingredient'
    );
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

const deleteGroceryListIngredientsForGroceryList = groceryListId =>
  pg.pgQuery(SQL`
    delete from grocery_list_ingredients
    where grocery_list_id = ${groceryListId}
  `);

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
  deleteOneGroceryListIngredient,
  deleteGroceryListIngredientsForGroceryList
};
