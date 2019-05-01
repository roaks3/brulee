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

export interface GroceryList {
  id?: string;
  week_start?: Date;
  created_at?: Date;
}

export interface RecipeDayResponse {
  recipe_id?: string;
  day_of_week?: number;
}

export interface AdditionalIngredientResponse {
  ingredient_id?: string;
  amount?: string;
  unit?: string;
}

export interface GroceryListResponse {
  id?: string;
  week_start?: string;
  recipe_days?: RecipeDayResponse[];
  additional_ingredients?: AdditionalIngredientResponse[];
}

export type RecipeDayRequest = RecipeDayResponse;
export type AdditionalIngredientRequest = AdditionalIngredientResponse;
