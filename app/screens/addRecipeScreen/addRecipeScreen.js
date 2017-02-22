import angular from 'angular';

import Category from '../../scripts/datastores/Category';
import Ingredient from '../../scripts/datastores/Ingredient';
import Recipe from '../../scripts/datastores/Recipe';
import categoryService from '../../scripts/services/categoryService';
import ingredientParseService from '../../scripts/services/ingredientParseService';
import ingredientService from '../../scripts/services/ingredientService';
import statusBar from '../../components/statusBar/statusBar';
import newRecipeIngredientInput from '../../components/newRecipeIngredientInput/newRecipeIngredientInput';

import template from './addRecipeScreen.html';
import './addRecipeScreen.scss';

class AddRecipeScreenCtrl {

  constructor ($q, Category, categoryService, Ingredient, ingredientParseService, ingredientService, Recipe) {
    'ngInject';

    this.$q = $q;
    this.Category = Category;
    this.categoryService = categoryService;
    this.Ingredient = Ingredient;
    this.ingredientParseService = ingredientParseService;
    this.ingredientService = ingredientService;
    this.Recipe = Recipe;
  }

  $onInit () {
    this.errors = [];

    this.Category
      .refreshAll()
      .catch(error => {
        this.errors.push(error);
      });
  }

  createNewIngredients (recipe) {
    const ingredientsToCreate = _(recipe.recipe_ingredients)
      .map('ingredient')
      .reject('id')
      .value();

    return this.$q
      .all(_.map(ingredientsToCreate, ingredient => {
        return this.Ingredient.create({name: ingredient.name});
      }));
  }

  updateCategories (recipe) {
    let categoriesToUpdate = [];

    _.each(recipe.recipe_ingredients, recipeIngredient => {
      if (recipeIngredient.selectedCategory && !this.isCategorized(recipeIngredient)) {
        let category = recipeIngredient.selectedCategory;
        const ingredient = this.ingredientService.getByName(recipeIngredient.ingredient.name);

        category.ingredient_ids.push(ingredient.id);
        categoriesToUpdate.push(category);
      }
    });

    return this.categoryService.updateAll(categoriesToUpdate);
  }

  updateRecipeIngredients (recipe) {
    _.each(recipe.recipe_ingredients, recipeIngredient => {
      recipeIngredient.ingredient = this.ingredientService.getByName(recipeIngredient.ingredient.name);
    });
  }

  addRecipe () {
    // Make sure there is a recipe name present
    if (!this.recipe.name) {
      this.isNameInvalid = true;
      return;
    }

    this.createNewIngredients(this.recipe)
      .then(() => this.updateCategories(this.recipe))
      .then(() => this.updateRecipeIngredients(this.recipe))
      .then(() => {
        return this.Recipe
          .create(_.assign(
            _.pick(this.recipe, ['name', 'original_text', 'url']),
            {
              recipe_ingredients: _.map(this.recipe.recipe_ingredients, recipeIngredient => ({
                ingredient_id: recipeIngredient.ingredient.id,
                amount: recipeIngredient.amount
              }))
            }
          ));
      })
      .then(() => {
        this.successMessage = 'Recipe saved!';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  parseRecipeText () {
    let recipeIngredients = this.ingredientParseService.parseAll(this.recipe.original_text);

    const ingredientNames = _(recipeIngredients)
      .map('ingredient.name')
      .uniq()
      .value();

    this.ingredientService
      .findAllIngredientsByName(ingredientNames)
      .then(() => {
        _.each(recipeIngredients, recipeIngredient => {
          const existingIngredient = this.ingredientService.getByName(recipeIngredient.ingredient.name);
          if (existingIngredient) {
            recipeIngredient.ingredient = existingIngredient;
          }

          recipeIngredient.selectedCategory = this.categoryService.getByIngredientId(recipeIngredient.ingredient.id);
        });

        this.recipe.recipe_ingredients = recipeIngredients;
        this.isParsed = true;
      });
  }

  removeRecipeIngredient (recipeIngredient) {
    _.pull(this.recipe.recipe_ingredients, recipeIngredient);
  }

  isCategorized (recipeIngredient) {
    // TODO: This should probably use some other field to reflect whether the
    // selected category needs to be saved
    if (recipeIngredient && recipeIngredient.ingredient) {
      return !!this.categoryService.getByIngredientId(recipeIngredient.ingredient.id);
    }
    return false;
  }

  updateRecipeIngredient (recipeIngredient, ingredient) {
    recipeIngredient.ingredient = ingredient || null;
  }

  updateRecipeIngredientCategory (recipeIngredient, category) {
    recipeIngredient.selectedCategory = category || null;
  }

}

export default angular
  .module('screens.addRecipeScreen', [
    Category,
    Ingredient,
    Recipe,
    categoryService,
    ingredientParseService,
    ingredientService,
    statusBar,
    newRecipeIngredientInput
  ])
  .component('addRecipeScreen', {
    template,
    controller: AddRecipeScreenCtrl
  })
  .name;
