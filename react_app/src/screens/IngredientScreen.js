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

  handleDelete = () => {
    if (!window.confirm(`Remove '${this.state.ingredient.name}'?`)) {
      return;
    }

    jsonFetch(`/api/ingredients/${this.state.ingredient.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        console.log('Success');
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleSave = () => {
    jsonFetch(`/api/ingredients/${this.state.ingredient.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: this.state.ingredient.name
      })
    })
      .then(() => {
        console.log('Success');
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleNameChange = e => {
    const name = e.target.value;
    this.setState(prevState => ({
      ingredient: {
        ...prevState.ingredient,
        name
      }
    }));
  };

  render() {
    return (
      <div>
        <button class="btn-primary" onClick={this.handleSave}>
          Save
        </button>

        <button class="btn-delete" onClick={this.handleDelete}>
          Delete
        </button>

        <h1>
          <input
            type="text"
            value={this.state.ingredient && this.state.ingredient.name}
            onChange={this.handleNameChange}
          />
        </h1>

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
