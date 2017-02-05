'use strict';

class RecipeScreenCtrl {

  constructor ($q, $state, $stateParams, $window, Category, Recipe) {
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
      ri => _.pick(ri, ['ingredient_id', 'amount']));

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

}

angular.module('bruleeApp')
  .component('recipeScreen', {
    controller: RecipeScreenCtrl,
    controllerAs: 'vm',
    templateUrl: 'screens/recipeScreen/recipeScreen.html'
  });
