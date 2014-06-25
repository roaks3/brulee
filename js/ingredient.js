
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

	Ingredient.addAmounts = function(leftAmount, rightAmount) {
		var resultAmount = "";
		if (leftAmount == null) {
			resultAmount = rightAmount;
		} else if (rightAmount == null) {
			resultAmount = leftAmount;
		} else {
			resultAmount = leftAmount + " + " + rightAmount;
			//resultAmount = Ratio.parse(leftAmount).add(rightAmount).simplify().toLocaleString();
		}
		return resultAmount;
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
	}

	Ingredients.prototype.get = function(index) {
		return this._ingredients[index];
	}

	Ingredients.prototype.add = function(ingredient) {
		if (ingredient == null) {
			return;
		}

		/*// Add duplicates
		this._ingredients.push(ingredient);*/

		// Add without duplicates
		var item = ingredient._item;
		var amount = ingredient._amount;

		for (var i = 0; i < this._ingredients.length; i++) {
			var existingIngredient = this._ingredients[i];
			if (existingIngredient._item == item) {
				var newAmount = Ingredient.addAmounts(existingIngredient._amount, amount);
				existingIngredient._amount = newAmount;
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

	return Ingredients;

} ());
