import * as _ from 'lodash';
import * as express from 'express';
import { IngredientResponse } from '../models/ingredient.model';
import * as groceryListService from '../services/groceryList.service';
import * as ingredientService from '../services/ingredient.service';
import * as ingredientSerializer from '../serializers/ingredient.serializer';
import * as recipeService from '../services/recipe.service';

export const index = async (
  req: express.Request
): Promise<IngredientResponse[]> => {
  const ingredients = await ingredientService.find({
    ids: _.isString(req.query.ids) ? [req.query.ids] : req.query.ids,
    names: _.isString(req.query.names) ? [req.query.names] : req.query.names
  });

  return ingredients.map(ingredientSerializer.serialize);
};

export const show = async (
  req: express.Request
): Promise<IngredientResponse> => {
  const ingredients = await ingredientService.find({ ids: [req.params.id] });

  return ingredients && ingredients.length
    ? ingredientSerializer.serialize(ingredients[0])
    : {};
};

export const create = async (
  req: express.Request
): Promise<IngredientResponse> => {
  const created = await ingredientService.create(req.body);

  return ingredientSerializer.serialize(created);
};

export const update = async (
  req: express.Request
): Promise<IngredientResponse> => {
  if (req.body.name) {
    const ingredientsWithSameName = await ingredientService.find({
      names: [req.body.name]
    });
    if (ingredientsWithSameName.some(i => i.id !== req.params.id)) {
      throw new Error('This ingredient name already exists');
    }
  }

  const updated = await ingredientService.update(req.params.id, req.body);

  return ingredientSerializer.serialize(updated);
};

export const destroy = async (
  req: express.Request
): Promise<IngredientResponse> => {
  const associatedRecipes = await recipeService.find({
    ingredientId: req.params.id
  });
  if (associatedRecipes.length) {
    throw new Error(
      `Cannot delete because ingredient is being used in recipes: [${associatedRecipes
        .map(r => r.name)
        .join(', ')}]`
    );
  }

  // Eliminate orphaned references in grocery lists without requiring the user to do so manually
  await groceryListService.deleteGroceryListIngredients({
    ingredientId: req.params.id
  });

  const deleted = await ingredientService.deleteOne(req.params.id);

  return ingredientSerializer.serialize(deleted);
};
