import angular from 'angular';

import Category from '../datastores/Category';
import GroceryList from '../datastores/GroceryList';
import Recipe from '../datastores/Recipe';
import groceryListService from './groceryListService';

const UNCATEGORIZED = {
  name: 'Uncategorized',
  order: 0
};

class GroceryListPageStore {

  constructor ($window, Category, GroceryList, groceryListService, Recipe) {
    'ngInject';

    this.$window = $window;
    this.Category = Category;
    this.GroceryList = GroceryList;
    this.groceryListService = groceryListService;
    this.Recipe = Recipe;
  }

  fetchGroceryList (id) {
    return this.GroceryList
      .find(id)
      .then(groceryList => {
        this.selectedGroceryList = groceryList;
      });
  }

  fetchAllRecipes () {
    return this.Recipe
      .findAll()
      .then(recipes => {
        if (this.recipeUseCountsByRecipeId) {
          this.recipes = _.sortBy(recipes, recipe => this.recipeUseCountsByRecipeId[recipe.id] || 0).reverse();
        } else {
          this.recipes = recipes;
        }
      });
  }

  fetchAllRecipesForGroceryList () {
    return this.groceryListService
      .findAllRecipesById(_.map(this.selectedGroceryList.recipe_days, 'recipe_id'))
      .then(recipes => {
        this.selectedRecipes = recipes;
      });
  }

  fetchAllIngredientsForGroceryList () {
    return this.groceryListService
      .findAllIngredientsForGroceryList(this.selectedGroceryList, this.selectedRecipes)
      .then(ingredients => {
        this.selectedIngredients = ingredients;
      });
  }

  fetchAllCategories () {
    return this.Category
      .findAll()
      .then(categories => {
        this.categories = categories;
      });
  }

  fetchRecipeUseCounts () {
    return this.GroceryList
      .findAll()
      .then(groceryLists => {
        this.recipeUseCountsByRecipeId = groceryLists.reduce((memo, groceryList) => {
          const recipeIds = groceryList.recipe_days.map(recipeDay => recipeDay.recipe_id);
          recipeIds.forEach(recipeId => {
            memo[recipeId] = (memo[recipeId] || 0) + 1;
          });
          return memo;
        }, {});
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
        this.selectedIngredients = [...this.selectedIngredients, ingredient];
        this.selectedGroceryList = groceryList;
      });
  }

  selectCategoriesForIngredients () {
    const ingredientIds = this.selectedIngredients.map(ingredient => ingredient.id);
    let categories = this.categories.filter(category => {
      return category.ingredient_ids.some(ingredientId => ingredientIds.includes(ingredientId));
    });

    // Add Uncategorized if there are ingredients with no category
    const categorizedIngredientIds = _(this.categories).map('ingredient_ids').flatten().uniq().value();
    const uncategorized =
      this.selectedIngredients.some(ingredient => !categorizedIngredientIds.includes(ingredient.id));
    if (uncategorized) {
      categories = [...categories, UNCATEGORIZED];
    }

    return _.sortBy(categories, 'order');
  }

  selectIngredientsForCategory (categoryId) {
    const category = this.categories.find(category => category.id === categoryId);
    if (!category) {
      const categorizedIngredientIds = _(this.categories).map('ingredient_ids').flatten().uniq().value();
      return this.selectedIngredients.filter(ingredient => !categorizedIngredientIds.includes(ingredient.id));
    }
    return this.selectedIngredients.filter(ingredient => category.ingredient_ids.includes(ingredient.id));
  }

  selectRecipesForIngredient (ingredientId) {
    return this.selectedRecipes.filter(recipe => {
      return _.map(recipe.recipe_ingredients, 'ingredient_id').includes(ingredientId);
    });
  }

  selectRecipesForDayOfWeek (dayOfWeek) {
    const recipeIds = this.selectedGroceryList.recipe_days
      .filter(recipeDay => recipeDay.day_of_week === dayOfWeek)
      .map(recipeDay => recipeDay.recipe_id);

    return this.selectedRecipes.filter(recipe => recipeIds.includes(recipe.id));
  }

}

export default angular
  .module('services.groceryListPageStore', [
    groceryListService,
    Category,
    GroceryList,
    Recipe
  ])
  .service('groceryListPageStore', GroceryListPageStore)
  .name;
