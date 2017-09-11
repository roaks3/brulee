import angular from 'angular';
import uiRouter from 'angular-ui-router';

import Category from '../../scripts/datastores/Category';
import Recipe from '../../scripts/datastores/Recipe';
import statusBar from '../../components/statusBar/statusBar';
import recipeIngredientInput from '../../components/recipeIngredientInput/recipeIngredientInput';
import listTextArea from '../../components/listTextArea/listTextArea';

import template from './recipeScreen.html';
import './recipeScreen.scss';

class RecipeScreenCtrl {

  constructor ($q, $state, $stateParams, $window, Category, Recipe) {
    'ngInject';

    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.Category = Category;
    this.Recipe = Recipe;
    this.recipe = {};
    this.errors = [];
    this.successMessage = null;
  }

  $onInit () {
    this.$q.all([
      this.Recipe.find(this.$stateParams.id),
      // HACK: This should be fixed by using a category id field directly on the ingredient
      this.Category.refreshAll()
    ])
      .then(([recipe]) => {
        this.recipe = _.cloneDeep(recipe);
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  delete () {
    this.errors = [];
    this.successMessage = null;

    if (!this.$window.confirm('Remove \'' + this.recipe.name + '\'?')) {
      return;
    }

    this.Recipe
      .destroy(this.recipe.id)
      .then(() => {
        this.$state.go('recipes');
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  save () {
    this.errors = [];
    this.successMessage = null;

    if (!_.every(this.recipe.recipe_ingredients, 'ingredient_id')) {
      this.$window.alert('Recipe cannot be saved with invalid ingredients');
      return;
    }

    const recipeIngredients = _.map(this.recipe.recipe_ingredients,
      ri => _.pick(ri, ['ingredient_id', 'amount', 'unit']));

    this.Recipe
      .update(this.recipe.id, _.assign(
        _.pick(this.recipe, [
          'name',
          'url',
          'tags',
          'prepare_time_in_minutes',
          'cook_time_in_minutes',
          'original_text',
          'instructions',
          'modifications',
          'nutrition_facts'
        ]),
        {recipe_ingredients: recipeIngredients}
      ))
      .then(() => {
        this.successMessage = 'Saved recipe';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  addRecipeIngredient () {
    this.recipe.recipe_ingredients.push({
      ingreident_id: null,
      amount: 1
    });
  }

  removeRecipeIngredient (recipeIngredient) {
    _.pull(this.recipe.recipe_ingredients, recipeIngredient);
  }

  updateRecipeIngredient (recipeIngredient, ingredientId) {
    recipeIngredient.ingredient_id = ingredientId || null;
  }

  updateRecipeIngredientAmount (recipeIngredient, amount) {
    recipeIngredient.amount = amount || null;
  }

  updateRecipeIngredientUnit (recipeIngredient, unit) {
    recipeIngredient.unit = unit || null;
  }

}

export default angular
  .module('screens.recipeScreen', [
    uiRouter,
    Category,
    Recipe,
    statusBar,
    listTextArea,
    recipeIngredientInput
  ])
  .component('recipeScreen', {
    template,
    controller: RecipeScreenCtrl,
    controllerAs: 'vm'
  })
  .name;
