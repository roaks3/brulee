import {
  Recipe,
  RecipeIngredient,
  RecipeResponse
} from '../models/recipe.model';

export const serialize = (
  recipe: Recipe,
  recipeIngredients: RecipeIngredient[]
): RecipeResponse => ({
  id: recipe.id,
  name: recipe.name,
  use_count: recipe.use_count,
  url: recipe.url,
  tags: recipe.tags,
  prepare_time_in_minutes: recipe.prepare_time_in_minutes,
  cook_time_in_minutes: recipe.cook_time_in_minutes,
  original_text: recipe.original_text,
  instructions: recipe.instructions,
  modifications: recipe.modifications,
  nutrition_facts: recipe.nutrition_facts,
  recipe_ingredients: recipeIngredients.map(recipeIngredient => ({
    ingredient_id: recipeIngredient.ingredient_id,
    amount: recipeIngredient.amount,
    unit: recipeIngredient.unit
  }))
});
