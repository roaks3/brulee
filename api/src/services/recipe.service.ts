import * as _ from 'lodash';
import * as pg from './pg.service';
import { Recipe, RecipeIngredient } from '../models/recipe.model';

export interface FindOpts {
  ids?: string[];
  ingredientId?: string;
  includeUseCounts?: boolean;
}

export interface FindRecipeIngredientsOpts {
  recipeIds?: string[];
}

export const find = async ({
  ids,
  ingredientId,
  includeUseCounts
}: FindOpts): Promise<Recipe[]> => {
  const query = pg.knex('recipes').select('recipes.*');

  if (ids) {
    query.whereIn('recipes.id', ids);
  }

  if (ingredientId) {
    query
      .innerJoin(
        'recipe_ingredients',
        'recipes.id',
        'recipe_ingredients.recipe_id'
      )
      .where('recipe_ingredients.ingredient_id', ingredientId);
  }

  if (includeUseCounts) {
    query
      .count('grocery_lists.id as use_count')
      .leftJoin(
        'grocery_list_recipes',
        'recipes.id',
        'grocery_list_recipes.recipe_id'
      )
      .leftJoin('grocery_lists', function() {
        this.on(
          'grocery_list_recipes.grocery_list_id',
          '=',
          'grocery_lists.id'
        ).andOn(
          'grocery_lists.created_at',
          '>',
          pg.knex.raw("now() - interval '5 months'")
        );
      })
      .groupBy('recipes.id');
  }

  const results = await query;

  // Cast count from a string (used to support postgres bigint) to a number
  return results.map((result: any) => ({
    ...result,
    use_count: parseInt(result.use_count || '0', 10)
  }));
};

export const create = async (obj: Recipe): Promise<Recipe> => {
  const fields = _.pick(obj, ['name', 'original_text', 'url']);

  const [result] = await pg
    .knex('recipes')
    .insert(fields)
    .returning('*');

  return result || {};
};

export const update = async (id: string, obj: Recipe): Promise<Recipe> => {
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

export const deleteOne = (id: string): Promise<Recipe> =>
  Promise.resolve(
    pg
      .knex('recipes')
      .del()
      .where({ id })
      .return({ id })
  );

export const findRecipeIngredients = ({
  recipeIds
}: FindRecipeIngredientsOpts): Promise<RecipeIngredient[]> => {
  const query = pg.knex('recipe_ingredients').select();

  if (recipeIds) {
    query.whereIn('recipe_id', recipeIds);
  }

  return Promise.resolve(query);
};

export const createRecipeIngredient = async (
  obj: RecipeIngredient
): Promise<RecipeIngredient> => {
  const fields = _.pick(obj, ['recipe_id', 'ingredient_id', 'amount', 'unit']);

  const [result] = await pg
    .knex('recipe_ingredients')
    .insert(fields)
    .returning('*');

  return result || {};
};

export const updateRecipeIngredient = async (
  recipeId: string,
  ingredientId: string,
  obj: RecipeIngredient
): Promise<RecipeIngredient> => {
  const fields = _.pick(obj, ['amount', 'unit']);

  const [result] = await pg
    .knex('recipe_ingredients')
    .update(fields)
    .where({ recipe_id: recipeId, ingredient_id: ingredientId })
    .returning('*');

  return result || {};
};

export const deleteOneRecipeIngredient = (
  recipeId: string,
  ingredientId: string
): Promise<any> =>
  Promise.resolve(
    pg
      .knex('recipe_ingredients')
      .del()
      .where({ recipe_id: recipeId, ingredient_id: ingredientId })
  );

export const deleteRecipeIngredientsForRecipe = (
  recipeId: string
): Promise<any> =>
  Promise.resolve(
    pg
      .knex('recipe_ingredients')
      .del()
      .where({ recipe_id: recipeId })
  );
