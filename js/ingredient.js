
var Ingredient = (function() {

    var Ingredient = function(item, amount) {
        this._item = item;
        this._amount = amount;
    };

    Ingredient.parse = function(text) {
        if (text == null) {
            return null;
        }

        text = text.trim();
        if (text == "") {
            return null;
        }

        var amount = "" + text.match(/^\d[\/\d]*/);
        if (amount == null) {
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
        this._ingredients = [];
    };

    Ingredients.parse = function(text) {
        if (text == null) {
            return null;
        }

        var ingredients = new Ingredients();
        var unparsedIngredients = text.split("\n");
        for (var i = 0; i < unparsedIngredients.length; i++) {
            var ingredient = Ingredient.parse(unparsedIngredients[i]);
            ingredients.add(ingredient);
        }

        return ingredients;
    };

    Ingredients.prototype.size = function() {
        return this._ingredients.length;
    };

    Ingredients.prototype.get = function(index) {
        return this._ingredients[index];
    };

    // Slow search functionality
    Ingredients.prototype.getByItem = function(item) {
        for (var i = 0; i < this.size(); i++) {
            var ingredient = this.get(i);
            if (ingredient._item == item) {
                return ingredient;
            }
        }
        return null;
    };

    Ingredients.prototype.add = function(ingredient) {
        if (ingredient == null) {
            return;
        }

        this._ingredients.push(ingredient);
    };

    Ingredients.prototype.combine = function(ingredient) {
        if (ingredient == null) {
            return;
        }

        var item = ingredient._item;
        var amount = ingredient._amount;

        for (var i = 0; i < this._ingredients.length; i++) {
            var existingIngredient = this._ingredients[i];
            if (existingIngredient._item == item) {
                existingIngredient._amount = existingIngredient._amount + " + " + amount;
                //existingIngredient._amount = Ratio.parse(existingIngredient._amount).add(amount).simplify().toLocaleString();
                return;
            }
        }

        // Ingredient does not exist yet
        this._ingredients.push(ingredient);
    };

    Ingredients.prototype.addAll = function(ingredients) {
        for (var i = 0; i < ingredients._ingredients.length; i++) {
            var ingredient = ingredients._ingredients[i];
            this.add(ingredient);
        }
    };

    Ingredients.prototype.combineAll = function(ingredients) {
        for (var i = 0; i < ingredients._ingredients.length; i++) {
            var ingredient = ingredients._ingredients[i];
            this.combine(ingredient);
        }
    };

    Ingredients.prototype.removeByItem = function(item) {
        for (var i = 0; i < this.size(); i++) {
            var ingredient = this.get(i);
            if (ingredient._item == item) {
                this._ingredients.splice(i, 1);
                return;
            }
        }
    };

    return Ingredients;

} ());

var Recipe = (function() {

    var Recipe = function(name, ingredients, originalText) {
        this._name = name;
        this._ingredients = new Ingredients();
        if (ingredients != null) {
            this._ingredients.combineAll(ingredients);
        }
        this._originalText = originalText;
    };

    Recipe.prototype.getName = function() {
        return this._name;
    };

    Recipe.prototype.getIngredients = function() {
        return this._ingredients;
    };

    Recipe.prototype.getOriginalText = function() {
        return this._originalText;
    };

    Recipe.prototype.addIngredient = function(ingredient) {
        if (ingredient == null) {
            return;
        }

        this._ingredients.combine(ingredient);
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
            if (recipe.getName() == name) {
                return recipe;
            }
        }
        return null;
    };

    Recipes.prototype.add = function(recipe) {
        if (recipe == null) {
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
        this._name = name;
        this._order = order;
        this._items = [];
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                this._items.add(item);
            }
        }
    };

    Category.prototype.getName = function() {
        return this._name;
    };

    Category.prototype.getOrder = function() {
        return this._order;
    };

    Category.prototype.getItems = function() {
        return this._items;
    };

    Category.prototype.addItem = function(item) {
        if (item == null) {
            return;
        }

        this._items.push(item);
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
            if (category.getName() == name) {
                return category;
            }
        }
        return null;
    };

    Categories.prototype.add = function(category) {
        if (category == null) {
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
