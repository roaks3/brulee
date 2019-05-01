import moment from 'moment';
import {
  GroceryList,
  GroceryListIngredient,
  GroceryListRecipe,
  GroceryListResponse
} from '../models/groceryList.model';

export const serialize = (
  groceryList: GroceryList,
  groceryListRecipes: GroceryListRecipe[],
  groceryListIngredients: GroceryListIngredient[]
): GroceryListResponse => ({
  id: groceryList.id,
  week_start:
    groceryList.week_start &&
    moment(groceryList.week_start).format('YYYY-MM-DD'),
  recipe_days: groceryListRecipes.map(groceryListRecipe => ({
    recipe_id: groceryListRecipe.recipe_id,
    day_of_week: groceryListRecipe.day_of_week
  })),
  additional_ingredients: groceryListIngredients.map(groceryListIngredient => ({
    ingredient_id: groceryListIngredient.ingredient_id,
    amount: groceryListIngredient.amount
  }))
});
