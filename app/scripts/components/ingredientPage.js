'use strict';

class IngredientPageCtrl {

  constructor ($state, $stateParams, $window, Category, categoryService, Ingredient, Recipe, recipeService) {
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$window = $window;
    this.Category = Category;
    this.categoryService = categoryService;
    this.Ingredient = Ingredient;
    this.Recipe = Recipe;
    this.recipeService = recipeService;
    this.category = {};
    this.ingredients = [];
    this.ingredient = {};
    this.recipes = [];
    this.errors = [];
    this.successMessage = null;
  }

  $onInit () {
    this.Category.refreshAll()
      .then(() => {
        this.category = this.categoryService.getByIngredientId(this.$stateParams.id);
      })
      .catch(error => {
        this.errors.push(error);
      });

    this.Ingredient.refreshAll()
      .then(ingredients => {
        this.ingredients = ingredients;
        this.ingredient = this.Ingredient.get(this.$stateParams.id);
        this.ingredientName = this.ingredient.name;
      })
      .catch(error => {
        this.errors.push(error);
      });

    this.Recipe.refreshAll()
      .then(() => {
        this.recipes = this.recipeService.filterByIngredientId(this.$stateParams.id);
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  delete () {
    this.errors = [];
    this.successMessage = null;

    if (this.recipes && this.recipes.length) {
      this.$window.alert('Cannot delete because ingredient is being used in recipes');
      return;
    }

    if (this.category) {
      this.$window.alert('Cannot delete because ingredient belongs to a category');
      return;
    }

    if (!this.$window.confirm('Remove \'' + this.ingredient.name + '\'?')) {
      return;
    }

    this.Ingredient.destroy(this.ingredient.id)
      .then(() => {
        this.$state.go('ingredients');
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  save () {
    this.errors = [];
    this.successMessage = null;

    let otherIngredientNames = _(this.ingredients)
      .reject(['id', this.ingredient.id])
      .map('name')
      .value();

    if (_.includes(otherIngredientNames, this.ingredientName)) {
      this.$window.alert('This ingredient name already exists');
      return;
    }

    this.Ingredient.update(this.ingredient.id, {
      name: this.ingredientName
    })
      .then(() => {
        this.successMessage = 'Saved ingredient';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

}

angular.module('bruleeApp')
  .component('ingredientPage', {
    controller: IngredientPageCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/ingredientPage.html'
  });
