import * as _ from 'lodash';
import moment from 'moment';
import * as pg from './pg.service';

export interface GroceryList {
  id?: string;
  week_start?: Date;
  created_at?: Date;
}

export interface GroceryListRecipe {
  grocery_list_id?: string;
  recipe_id?: string;
  day_of_week?: number;
  scheduled_for?: Date;
}

export interface GroceryListIngredient {
  grocery_list_id?: string;
  ingredient_id?: string;
  amount?: string;
  unit?: string;
}

export interface FindOpts {
  ids?: string[];
  sortMostRecent?: boolean;
  limit?: number;
}

export interface FindGroceryListRecipesOpts {
  groceryListIds?: string[];
}

export interface FindGroceryListIngredientsOpts {
  groceryListIds?: string[];
}

export interface DeleteGroceryListIngredientsOpts {
  groceryListId?: string;
  ingredientId?: string;
}

export const find = ({
  ids,
  sortMostRecent,
  limit
}: FindOpts): Promise<GroceryList[]> => {
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

  return Promise.resolve(query);
};

export const create = async (obj: GroceryList): Promise<GroceryList> => {
  const [result] = await pg
    .knex('grocery_lists')
    .insert({
      week_start: moment(obj.week_start, 'YYYY-MM-DD').toDate()
    })
    .returning('*');

  return result || {};
};

export const update = async (
  id: string,
  obj: GroceryList
): Promise<GroceryList> => {
  const [result] = await pg
    .knex('grocery_lists')
    .update({
      week_start: moment(obj.week_start, 'YYYY-MM-DD').toDate()
    })
    .where({ id })
    .returning('*');

  return result || {};
};

export const deleteOne = (id: string): Promise<GroceryList> =>
  Promise.resolve(
    pg
      .knex('grocery_lists')
      .del()
      .where({ id })
      .return({ id })
  );

export const findGroceryListRecipes = ({
  groceryListIds
}: FindGroceryListRecipesOpts): Promise<GroceryListRecipe[]> => {
  const query = pg.knex('grocery_list_recipes').select();

  if (groceryListIds) {
    query.whereIn('grocery_list_id', groceryListIds);
  }

  return Promise.resolve(query);
};

export const createGroceryListRecipe = async (
  obj: GroceryListRecipe
): Promise<GroceryListRecipe> => {
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

export const deleteOneGroceryListRecipe = (
  groceryListId: string,
  recipeId: string,
  dayOfWeek: number
): Promise<void> =>
  Promise.resolve(
    pg
      .knex('grocery_list_recipes')
      .del()
      .where({
        grocery_list_id: groceryListId,
        recipe_id: recipeId,
        day_of_week: dayOfWeek
      })
  );

export const deleteGroceryListRecipesForGroceryList = (
  groceryListId: string
): Promise<void> =>
  Promise.resolve(
    pg
      .knex('grocery_list_recipes')
      .del()
      .where({ grocery_list_id: groceryListId })
  );

export const findGroceryListIngredients = ({
  groceryListIds
}: FindGroceryListIngredientsOpts): Promise<GroceryListIngredient[]> => {
  const query = pg.knex('grocery_list_ingredients').select();

  if (groceryListIds) {
    query.whereIn('grocery_list_id', groceryListIds);
  }

  return Promise.resolve(query);
};

export const createGroceryListIngredient = async (
  obj: GroceryListIngredient
): Promise<GroceryListIngredient> => {
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

export const updateGroceryListIngredient = async (
  groceryListId: string,
  ingredientId: string,
  obj: GroceryListIngredient
): Promise<GroceryListIngredient> => {
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

export const deleteGroceryListIngredients = ({
  groceryListId,
  ingredientId
}: DeleteGroceryListIngredientsOpts): Promise<void> =>
  Promise.resolve(
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
      )
  );
