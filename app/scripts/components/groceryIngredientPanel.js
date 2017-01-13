'use strict';

class GroceryIngredientPanelCtrl {

  constructor (GroceryList, groceryListPageStore, groceryIngredientService) {
    this.GroceryList = GroceryList;
    this.groceryListPageStore = groceryListPageStore;
    this.groceryIngredientService = groceryIngredientService;
  }

  $onInit () {
    this.groceryListPageStore.fetchCrossedOutIngredients();
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;

    return this.groceryIngredientService
      .generate(this.groceryList)
      .then((data) => {
        this.groceryIngredients = data;
      })
      .catch((error) => {
        this.onError({error});
      });
  }

  openAddIngredient () {
    this.showAddIngredient = true;
  }

  addIngredient (ingredient) {
    this.groceryList.additional_ingredients = this.groceryList.additional_ingredients || [];
    this.groceryList.additional_ingredients.push({
      ingredient_id: ingredient.id,
      amount: 1
    });

    this.GroceryList
      .update(this.groceryList.id, _.pick(this.groceryList, [
        'week_start',
        'recipe_days',
        'additional_ingredients'
      ]))
      .catch((error) => {
        this.onError({error});
      });
  }

  crossOut (ingredient) {
    this.groceryListPageStore.toggleCrossedOutIngredient(ingredient.id);
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;
  }

  clearCrossedOutIngredients () {
    this.groceryListPageStore.clearCrossedOutIngredients();
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;
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
