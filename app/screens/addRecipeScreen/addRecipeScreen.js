import angular from 'angular';

import Category from '../../scripts/datastores/Category';
import Ingredient from '../../scripts/datastores/Ingredient';
import Recipe from '../../scripts/datastores/Recipe';
import ingredientParseService from '../../scripts/services/ingredientParseService';
import statusBar from '../../components/statusBar/statusBar';
import newRecipeIngredientInput from '../../components/newRecipeIngredientInput/newRecipeIngredientInput';

import template from './addRecipeScreen.html';
import './addRecipeScreen.scss';

class AddRecipeScreenCtrl {

  constructor ($q, Category, Ingredient, ingredientParseService, Recipe) {
    'ngInject';

    this.$q = $q;
    this.Category = Category;
    this.Ingredient = Ingredient;
    this.ingredientParseService = ingredientParseService;
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
      .map(recipeIngredient =>
        Object.assign(
          {},
          recipeIngredient.ingredient, {
            category_id: recipeIngredient.selectedCategory && recipeIngredient.selectedCategory.id
          })
      )
      .reject('id')
      .value();

    return this.$q
      .all(_.map(ingredientsToCreate, ingredient => {
        return this.Ingredient.create({name: ingredient.name, category_id: ingredient.category_id});
      }));
  }

  updateRecipeIngredients (recipe) {
    _.each(recipe.recipe_ingredients, recipeIngredient => {
      recipeIngredient.ingredient = _.head(this.Ingredient.filter({ name: recipeIngredient.ingredient.name }));
    });
  }

  addRecipe () {
    // Make sure there is a recipe name present
    if (!this.recipe.name) {
      this.isNameInvalid = true;
      return;
    }

    this.createNewIngredients(this.recipe)
      .then(() => this.updateRecipeIngredients(this.recipe))
      .then(() => {
        return this.Recipe
          .create(_.assign(
            _.pick(this.recipe, ['name', 'original_text', 'url']),
            {
              recipe_ingredients: _.map(this.recipe.recipe_ingredients, recipeIngredient => ({
                ingredient_id: recipeIngredient.ingredient.id,
                amount: recipeIngredient.amount,
                unit: recipeIngredient.unit
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

    this.Ingredient
      .findAll({ names: ingredientNames })
      .then(() => {
        _.each(recipeIngredients, recipeIngredient => {
          const existingIngredient = _.head(this.Ingredient.filter({ name: recipeIngredient.ingredient.name }));
          if (existingIngredient) {
            recipeIngredient.ingredient = existingIngredient;
            recipeIngredient.selectedCategory = this.Category.get(recipeIngredient.ingredient.category_id || '');
          }
        });

        this.recipe.recipe_ingredients = recipeIngredients;
        this.isParsed = true;
      });
  }

  removeRecipeIngredient (recipeIngredient) {
    _.pull(this.recipe.recipe_ingredients, recipeIngredient);
  }

  updateRecipeIngredient (recipeIngredient, ingredient) {
    recipeIngredient.ingredient = ingredient || null;
  }

  updateRecipeIngredientAmount (recipeIngredient, amount) {
    recipeIngredient.amount = amount || null;
  }

  updateRecipeIngredientUnit (recipeIngredient, unit) {
    recipeIngredient.unit = unit || null;
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
    ingredientParseService,
    statusBar,
    newRecipeIngredientInput
  ])
  .component('addRecipeScreen', {
    template,
    controller: AddRecipeScreenCtrl
  })
  .name;
