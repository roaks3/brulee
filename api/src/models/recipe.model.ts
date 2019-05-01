export interface RecipeIngredientBase {
  ingredient_id?: string;
  amount?: string;
  unit?: string;
}

export interface RecipeIngredient extends RecipeIngredientBase {
  recipe_id?: string;
}

export interface RecipeBase {
  id?: string;
  name?: string;
  use_count?: number;
  url?: string;
  tags?: string;
  prepare_time_in_minutes?: number;
  cook_time_in_minutes?: number;
  original_text?: string;
  instructions?: string;
  modifications?: string;
  nutrition_facts?: string;
}

export type Recipe = RecipeBase;

export type RecipeIngredientResponse = RecipeIngredientBase;

export interface RecipeResponse extends RecipeBase {
  recipe_ingredients?: RecipeIngredientResponse[];
}

export type RecipeIngredientRequest = RecipeIngredientResponse;
