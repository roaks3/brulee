
var Ingredient = (function() {

    var Ingredient = function(item, amount) {
        this.item = item;
        this.amount = amount;
    };

    Ingredient.parse = function(text) {
        if (text === null) {
            return null;
        }

        text = text.trim();
        if (text === "") {
            return null;
        }

        var amount = "" + text.match(/^\d[\/\d]*/);
        if (amount === null) {
            amount = "1";
        }

        var item = text.substr(amount.length);
        item = item.trim();

        return new Ingredient(item, amount);
    };

    return Ingredient;

} ());

var Ingredients = (function() {

    var Ingredients = function() {
    };

    Ingredients.parse = function(text) {
        if (text === null) {
            return null;
        }

        var ingredients = [];
        var unparsedIngredients = text.split("\n");
        for (var i = 0; i < unparsedIngredients.length; i++) {
            var ingredient = Ingredient.parse(unparsedIngredients[i]);
            ingredients.push(ingredient);
        }

        return ingredients;
    };

    // Slow search functionality
    Ingredients.getByItem = function(ingredients, item) {
        for (var i = 0; i < ingredients.length; i++) {
            var ingredient = ingredients[i];
            if (ingredient.item === item) {
                return ingredient;
            }
        }
        return null;
    };

    Ingredients.combine = function(ingredients, otherIngredient) {
        if (otherIngredient === null) {
            return ingredients;
        }

        var item = otherIngredient.item;
        var amount = otherIngredient.amount;

        for (var i = 0; i < ingredients.length; i++) {
            var existingIngredient = ingredients[i];
            if (existingIngredient.item === item) {
                existingIngredient.amount = existingIngredient.amount + " + " + amount;
                //existingIngredient.amount = Ratio.parse(existingIngredient.amount).add(amount).simplify().toLocaleString();
                return ingredients;
            }
        }

        // Ingredient does not exist yet
        ingredients.push(otherIngredient);

        return ingredients;
    };

    Ingredients.combineAll = function(ingredients, otherIngredients) {
        for (var i = 0; i < otherIngredients.length; i++) {
            var otherIngredient = otherIngredients[i];
            ingredients = Ingredients.combine(ingredients, otherIngredient);
        }
        return ingredients;
    };

    return Ingredients;

} ());

var Recipe = (function() {

    var Recipe = function(name, ingredients, originalText) {
        this.name = name;
        this.ingredients = [];
        if (ingredients !== null) {
            this.ingredients = Ingredients.combineAll(this.ingredients, ingredients);
        }
        this.originalText = originalText;
    };

    Recipe.prototype.addIngredient = function(ingredient) {
        if (ingredient === null) {
            return;
        }

        this.ingredients = Ingredients.combine(this.ingredients, ingredient);
    };

    return Recipe;

} ());

var Recipes = (function() {

    var Recipes = function() {
        this._recipes = [];
    };

    Recipes.prototype.size = function() {
        return this._recipes.length;
    };

    Recipes.prototype.get = function(index) {
        return this._recipes[index];
    };

    // Slow search functionality
    Recipes.prototype.getByName = function(name) {
        for (var i = 0; i < this.size(); i++) {
            var recipe = this.get(i);
            if (recipe.name === name) {
                return recipe;
            }
        }
        return null;
    };

    Recipes.prototype.add = function(recipe) {
        if (recipe === null) {
            return;
        }

        this._recipes.push(recipe);
    };

    Recipes.prototype.addAll = function(recipes) {
        for (var i = 0; i < recipes._recipes.length; i++) {
            var recipe = recipes._recipes[i];
            this.add(recipe);
        }
    };

    return Recipes;

} ());

var ElasticSearchRecipeStore = (function() {

    var ElasticSearchRecipeStore = function() {
    };

    ElasticSearchRecipeStore.prototype.getAllRecipes = function(callback) {
        $.ajax({
            type: "GET",
            url: "http://localhost:9200/recipes/recipe/_search?q=*&size=500",
            contentType: "application/json",
            success: function(data) {
                var recipes = new Recipes();
                var hitsJson = data;
                for (var i in hitsJson.hits.hits) {
                    var recipeJson = hitsJson.hits.hits[i]._source;
                    var name = recipeJson._name;
                    var recipe = new Recipe(name, null, recipeJson._originalText);
                    for (var j in recipeJson._ingredients._ingredients) {
                        var ingredientJson = recipeJson._ingredients._ingredients[j];
                        var ingredient = new Ingredient(ingredientJson._item, ingredientJson._amount);
                        recipe.addIngredient(ingredient);
                    }
                    recipes.add(recipe);
                }
                callback(recipes);
            }
        });
    };

    ElasticSearchRecipeStore.prototype.saveAllRecipes = function(recipes) {
        for (var i = 0; i < recipes.size(); i++) {
            this.saveRecipe(recipes.get(i));
        }
    };

    ElasticSearchRecipeStore.prototype.saveRecipe = function(recipe) {
        var jsonString = JSON.stringify(recipe);
        $.ajax({
            type: "POST",
            url: "http://localhost:9200/recipes/recipe/",
            contentType: "application/json",
            data: jsonString
        });
    };

    return ElasticSearchRecipeStore;

} ());

var Category = (function() {

    var Category = function(name, order, items) {
        this.name = name;
        this.order = order;
        this.items = [];
        if (items !== null) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                this.items.add(item);
            }
        }
    };

    Category.prototype.addItem = function(item) {
        if (item === null) {
            return;
        }

        this.items.push(item);
    };

    return Category;

} ());

var Categories = (function() {

    var Categories = function() {
        this._categories = [];
    };

    Categories.prototype.size = function() {
        return this._categories.length;
    };

    Categories.prototype.get = function(index) {
        return this._categories[index];
    };

    // Slow search functionality
    Categories.prototype.getByName = function(name) {
        for (var i = 0; i < this.size(); i++) {
            var category = this.get(i);
            if (category.name === name) {
                return category;
            }
        }
        return null;
    };

    Categories.prototype.add = function(category) {
        if (category === null) {
            return;
        }

        this._categories.push(category);
    };

    Categories.prototype.addAll = function(categories) {
        for (var i = 0; i < categories._categories.length; i++) {
            var category = categories._categories[i];
            this.add(category);
        }
    };

    return Categories;

} ());

var ElasticSearchShoppingListStore = (function() {

    var ElasticSearchShoppingListStore = function() {
    };

    ElasticSearchShoppingListStore.prototype.getAllCategories = function(callback) {
        $.ajax({
            type: "GET",
            url: "http://localhost:9200/recipes/category/_search?q=*",
            contentType: "application/json",
            success: function(data) {
                var categories = new Categories();
                var hitsJson = data;
                for (var i in hitsJson.hits.hits) {
                    var categoryJson = hitsJson.hits.hits[i]._source;
                    var name = categoryJson._name;
                    var order = categoryJson._order;
                    var category = new Category(name, order, null);
                    for (var j in categoryJson._items) {
                        var item = categoryJson._items[j];
                        category.addItem(item);
                    }
                    categories.add(category);
                }
                callback(categories);
            }
        });
    };

    ElasticSearchShoppingListStore.prototype.saveCategory = function(category) {
        var jsonString = JSON.stringify(category);
        $.ajax({
            type: "POST",
            url: "http://localhost:9200/recipes/category/",
            contentType: "application/json",
            data: jsonString
        });
    };

    return ElasticSearchShoppingListStore;

} ());
