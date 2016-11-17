'use strict';

class GroceryIngredientPanelCtrl {

  constructor ($localStorage, GroceryList, groceryIngredientService) {
    this.$localStorage = $localStorage;
    this.GroceryList = GroceryList;
    this.groceryIngredientService = groceryIngredientService;
  }

  $onInit () {
    this.$localStorage.crossedOutIngredients = this.$localStorage.crossedOutIngredients || [];
    this.crossedOutIngredients = this.$localStorage.crossedOutIngredients;

    return this.groceryIngredientService
      .generate(this.groceryList)
      .then((data) => {
        this.groceryIngredients = data;
      })
      .catch((error) => {
        this.onError({error});
      });
  }

  addIngredient (ingredient) {
    this.groceryList.additional_ingredients = this.groceryList.additional_ingredients || [];
    this.groceryList.additional_ingredients.push({
      ingredient_id: ingredient.id,
      amount: 1
    });

    this.GroceryList
      .update(this.groceryList.id, {
        week_start: this.groceryList.week_start,
        recipe_days: this.groceryList.recipe_days,
        additional_ingredients: this.groceryList.additional_ingredients
      })
      .catch((error) => {
        this.onError({error});
      });
  }

  crossOut (ingredient) {
    if (_.includes(this.crossedOutIngredients, ingredient.id)) {
      _.pull(this.crossedOutIngredients, ingredient.id);
    } else {
      this.crossedOutIngredients.push(ingredient.id);
    }
  }

  clearCrossedOutIngredients () {
    this.$localStorage.crossedOutIngredients = [];
    this.crossedOutIngredients = this.$localStorage.crossedOutIngredients;
  }

}

angular.module('bruleeApp')
  .component('groceryIngredientPanel', {
    bindings: {
      groceryList: '<',
      onError: '&'
    },
    controller: GroceryIngredientPanelCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/groceryIngredientPanel.html'
  });
