const _ = require('lodash');
const { SQL } = require('sql-template-strings');
const pg = require('./pg.service');

const find = ({ ids }) => {
  const query = SQL`
    select *
    from recipes
  `;

  if (ids) {
    query.append(SQL`
      where id = any(${ids})
    `);
  }

  return pg.pgQuery(query);
};

const create = obj => {
  const fields = _.pick(obj, ['id', 'name', 'original_text', 'url']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create recipe');
  }

  return pg.pgQuery(
    pg.createSql('recipes', fields)
  );
};

const update = (id, obj) => {
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

  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to update recipe');
  }

  const query = pg.updateSql('recipes', fields);

  query.append(SQL`
    where id = ${id}
  `);

  return pg.pgQuery(query);
};

const deleteOne = id =>
  pg.pgQuery(SQL`
    delete from recipes
    where id = ${id}
  `);

const findRecipeIngredients = ({ recipeIds }) => {
  const query = SQL`
    select *
    from recipe_ingredients
  `;

  if (recipeIds) {
    query.append(SQL`
      where recipe_id = any(${recipeIds})
    `);
  }

  return pg.pgQuery(query);
};

const createRecipeIngredient = obj => {
  const fields = _.pick(obj, ['recipe_id', 'ingredient_id', 'amount', 'unit']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create recipe_ingredient');
  }

  return pg.pgQuery(
    pg.createSql('recipe_ingredients', fields)
  );
};

const updateRecipeIngredient = (recipeId, ingredientId, obj) => {
  const fields = _.pick(obj, ['amount', 'unit']);

  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to update recipe_ingredient');
  }

  const query = pg.updateSql('recipe_ingredients', fields);

  query.append(SQL`
    where recipe_id = ${recipeId} and ingredient_id = ${ingredientId}
  `);

  return pg.pgQuery(query);
};

const deleteOneRecipeIngredient = (recipeId, ingredientId) =>
  pg.pgQuery(SQL`
    delete from recipe_ingredients
    where recipe_id = ${recipeId} and ingredient_id = ${ingredientId}
  `);

const deleteRecipeIngredientsForRecipe = recipeId =>
  pg.pgQuery(SQL`
    delete from recipe_ingredients
    where recipe_id = ${recipeId}
  `);

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
