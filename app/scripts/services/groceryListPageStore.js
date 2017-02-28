import angular from 'angular';

import GroceryList from '../datastores/GroceryList';
import categoryStore from './categoryStore';
import ingredientStore from './ingredientStore';
import recipeStore from './recipeStore';

const UNCATEGORIZED = {
  name: 'Uncategorized',
  order: 0
};

class GroceryListPageStore {

  constructor ($q, $window, categoryStore, GroceryList, ingredientStore, recipeStore) {
    'ngInject';

    this.$q = $q;
    this.$window = $window;
    this.categoryStore = categoryStore;
    this.GroceryList = GroceryList;
    this.ingredientStore = ingredientStore;
    this.recipeStore = recipeStore;
  }

  fetchAllForGroceryList (groceryList) {
    let recipes = [];
    return this.$q
      .all([
        this.recipeStore.fetchRecipesForGroceryList(groceryList),
        this.categoryStore.fetchAllCategories()
      ])
      .then(() => {
        recipes = this.recipeStore.selectRecipesForGroceryList(groceryList);
      })
      .then(() => this.ingredientStore.fetchIngredientsForGroceryList(groceryList, recipes));
  }

  fetchGroceryList (id) {
    return this.GroceryList
      .find(id)
      .then(groceryList => {
        this.selectedGroceryList = groceryList;
      });
  }

  setSelectedGroceryList (groceryList) {
    this.selectedGroceryList = groceryList;
  }

  fetchCrossedOutIngredients () {
    this.crossedOutIngredientIds = JSON.parse(this.$window.localStorage.getItem('crossedOutIngredientIds')) || [];
  }

  toggleCrossedOutIngredient (ingredientId) {
    if (this.crossedOutIngredientIds.includes(ingredientId)) {
      this.crossedOutIngredientIds =
        this.crossedOutIngredientIds.filter(crossedOutIngredientId => crossedOutIngredientId !== ingredientId);
    } else {
      this.crossedOutIngredientIds = [...this.crossedOutIngredientIds, ingredientId];
    }
    this.$window.localStorage.setItem('crossedOutIngredientIds', JSON.stringify(this.crossedOutIngredientIds));
  }

  clearCrossedOutIngredients () {
    this.crossedOutIngredientIds = [];
    this.$window.localStorage.setItem('crossedOutIngredientIds', JSON.stringify(this.crossedOutIngredientIds));
  }

  addIngredientToGroceryList (ingredient) {
    const groceryList = Object.assign({}, this.selectedGroceryList, {
      additional_ingredients: [
        ...this.selectedGroceryList.additional_ingredients || [],
        {
          ingredient_id: ingredient.id,
          amount: 1
        }
      ]
    });

    return this.GroceryList
      .update(groceryList.id, _.pick(groceryList, [
        'week_start',
        'recipe_days',
        'additional_ingredients'
      ]))
      .then(() => {
        this.ingredientStore.addIngredient(ingredient);
        this.selectedGroceryList = groceryList;
      });
  }

  selectCategoriesForGroceryList (groceryList) {
    const ingredients = this.selectIngredientsForGroceryList(groceryList);
    const ingredientIds = ingredients.map(ingredient => ingredient.id);
    let categories = this.categoryStore.selectCategoriesForIngredients(ingredientIds);

    // Add Uncategorized if there are ingredients with no category
    const categorizedIngredientIds = _(categories).map('ingredient_ids').flatten().uniq().value();
    const uncategorized =
      ingredients.some(ingredient => !categorizedIngredientIds.includes(ingredient.id));
    if (uncategorized) {
      categories = [...categories, UNCATEGORIZED];
    }

    return _.sortBy(categories, 'order');
  }

  selectIngredientsForGroceryList (groceryList) {
    const recipes = this.recipeStore.selectRecipesForGroceryList(groceryList);
    return this.ingredientStore.selectIngredientsForGroceryList(groceryList, recipes);
  }

  selectIngredientsForCategory (groceryList, categoryId) {
    const ingredients = this.selectIngredientsForGroceryList(groceryList);
    const category = this.categoryStore.selectCategoryById(categoryId);
    if (!category) {
      const categories = this.categoryStore.selectAllCategories();
      const categorizedIngredientIds = _(categories).map('ingredient_ids').flatten().uniq().value();
      return ingredients.filter(ingredient => !categorizedIngredientIds.includes(ingredient.id));
    }
    return ingredients.filter(ingredient => category.ingredient_ids.includes(ingredient.id));
  }

  selectRecipesForIngredient (groceryList, ingredientId) {
    const recipes = this.recipeStore.selectRecipesForGroceryList(groceryList);
    return recipes.filter(recipe => {
      return _.map(recipe.recipe_ingredients, 'ingredient_id').includes(ingredientId);
    });
  }

  selectRecipesForDayOfWeek (groceryList, dayOfWeek) {
    const recipes = this.recipeStore.selectRecipesForGroceryList(groceryList);
    const recipeIds = groceryList.recipe_days
      .filter(recipeDay => recipeDay.day_of_week === dayOfWeek)
      .map(recipeDay => recipeDay.recipe_id);

    return recipes.filter(recipe => recipeIds.includes(recipe.id));
  }

}

export default angular
  .module('services.groceryListPageStore', [
    GroceryList,
    categoryStore,
    ingredientStore,
    recipeStore
  ])
  .service('groceryListPageStore', GroceryListPageStore)
  .name;
