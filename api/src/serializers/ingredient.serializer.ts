import { Ingredient, IngredientResponse } from '../models/ingredient.model';

export const serialize = (ingredient: Ingredient): IngredientResponse => ({
  id: ingredient.id,
  name: ingredient.name,
  category_id: ingredient.category_id
});
