'use strict';

class IngredientListScreenCtrl {

  constructor ($sessionStorage, $window, Ingredient) {
    this.Ingredient = Ingredient;
    this.ingredients = [];
    this.filteredIngredients = [];
    this.errors = [];
    this.successMessage = null;

    $sessionStorage.search = $sessionStorage.search || {str: ''};
    this.search = $sessionStorage.search;
  }

  $onInit () {
    this.Ingredient.refreshAll()
      .then(data => {
        this.ingredients = data;
        this.filterIngredients();
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  filterIngredients () {
    this.filteredIngredients = this.ingredients.filter(ingredient => {
      return ingredient.name && ingredient.name.toLowerCase().indexOf(this.search.str.toLowerCase()) !== -1;
    });
  }

  addIngredient (ingredient) {
    if (_.includes(_.map(this.ingredients, 'name'), ingredient.name)) {
      this.$window.alert('This ingredient already exists');
      return;
    }

    this.errors = [];
    this.successMessage = null;

    this.Ingredient
      .create({name: ingredient.name})
      .then(() => {
        this.successMessage = 'Created ingredient';
        this.ingredients = this.Ingredient.filter();
        this.filterIngredients();
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

}

angular.module('bruleeApp')
  .component('ingredientListScreen', {
    controller: IngredientListScreenCtrl,
    controllerAs: 'vm',
    templateUrl: 'screens/ingredientListScreen/ingredientListScreen.html'
  });
