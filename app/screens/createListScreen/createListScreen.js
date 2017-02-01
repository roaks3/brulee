'use strict';

class CreateListScreenCtrl {

  constructor (GroceryList, groceryListPageStore) {
    this.GroceryList = GroceryList;
    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.recipes = [];
    this.errors = [];

    this.groceryListPageStore
      .fetchRecipeUseCounts()
      .then(() => this.groceryListPageStore.fetchAllRecipes())
      .then(() => this.groceryListPageStore.fetchAllCategories())
      .then(() => {
        this.recipeUseCountsByRecipeId = this.groceryListPageStore.recipeUseCountsByRecipeId;
        this.recipes = this.groceryListPageStore.recipes;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  calculateShoppingList () {
    const selectedRecipes = _(this.recipes)
      .filter('_selected')
      .value();

    this.newGroceryList = {
      week_start: moment().day(0).format('YYYY-MM-DD'),
      recipe_days: _.map(selectedRecipes, recipe => ({
        recipe_id: recipe.id,
        day_of_week: 0
      }))
    };

    this.groceryListPageStore.setSelectedGroceryList(this.newGroceryList);
    this.groceryListPageStore
      .fetchAllRecipesForGroceryList()
      .then(() => this.groceryListPageStore.fetchAllIngredientsForGroceryList())
      .then(() => {
        this.categories = this.groceryListPageStore.selectCategoriesForIngredients();
      });
  }

  saveGroceryList () {
    this.errors = [];
    this.successMessage = null;

    if (this.newGroceryList.id) {
      //GroceryList.update($scope.newGroceryList);
      this.errors.push('Cannot update the grocery list in this view');
    } else {
      this.GroceryList
        .create({
          week_start: this.newGroceryList.week_start,
          recipe_days: _.map(this.newGroceryList.recipe_days, recipeDay => {
            return _.pick(recipeDay, ['recipe_id', 'day_of_week']);
          })
        })
        .then(() => {
          this.successMessage = 'Grocery list saved';
        })
        .catch(error => {
          this.errors.push(error);
        });
    }
  }

  updateDayOfWeek (recipeDay, day) {
    recipeDay.day_of_week = day;
  }

}

angular.module('bruleeApp')
  .component('createListScreen', {
    controller: CreateListScreenCtrl,
    templateUrl: 'screens/createListScreen/createListScreen.html'
  });
