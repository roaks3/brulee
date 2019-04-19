import React, { Component } from 'react';
import { jsonFetch } from '../api';

class IngredientScreen extends Component {
  state = {};

  componentWillMount() {
    const ingredientId = this.props.match.params.id;
    jsonFetch(`/api/ingredients/${ingredientId}`)
      .then(ingredient => {
        this.setState({ ingredient });

        if (!ingredient.category_id) {
          return;
        }

        return jsonFetch(`/api/categories/${ingredient.category_id}`).then(
          category => {
            this.setState({ category });
          }
        );
      })
      .then(() => {
        return jsonFetch(`/api/recipes?ingredientId=${ingredientId}`).then(
          recipes => {
            this.setState({ recipes });
          }
        );
      });
  }

  render() {
    return (
      <div>
        <h1>{this.state.ingredient && this.state.ingredient.name}</h1>

        <div>
          <button className="btn-select" disabled="disabled">
            {this.state.category && this.state.category.name}
          </button>
        </div>

        {this.state.recipes &&
          this.state.recipes.map(recipe => <h4>{recipe.name}</h4>)}
      </div>
    );
  }
}

export default IngredientScreen;
