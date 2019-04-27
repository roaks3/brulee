import React, { useState, useEffect } from 'react';
import { jsonFetch } from '../api';

const IngredientScreen = ({ match }) => {
  const [ingredient, setIngredient] = useState();
  const [category, setCategory] = useState();
  const [recipes, setRecipes] = useState();

  useEffect(() => {
    const ingredientId = match.params.id;
    jsonFetch(`/api/ingredients/${ingredientId}`)
      .then(i => {
        setIngredient(i);

        if (!i.category_id) {
          return;
        }

        return jsonFetch(`/api/categories/${i.category_id}`).then(c => {
          setCategory(c);
        });
      })
      .then(() => {
        return jsonFetch(`/api/recipes?ingredientId=${ingredientId}`).then(
          rs => {
            setRecipes(rs);
          }
        );
      });
  }, [match.params.id]);

  const handleDelete = () => {
    if (!window.confirm(`Remove '${ingredient.name}'?`)) {
      return;
    }

    jsonFetch(`/api/ingredients/${ingredient.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        console.log('Success');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSave = () => {
    jsonFetch(`/api/ingredients/${ingredient.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: ingredient.name
      })
    })
      .then(() => {
        console.log('Success');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleNameChange = e => {
    const name = e.target.value;
    setIngredient({
      ...ingredient,
      name
    });
  };

  return (
    <div>
      <button class="btn-primary" onClick={handleSave}>
        Save
      </button>

      <button class="btn-delete" onClick={handleDelete}>
        Delete
      </button>

      <h1>
        <input
          type="text"
          value={ingredient && ingredient.name}
          onChange={handleNameChange}
        />
      </h1>

      <div>
        <button className="btn-select" disabled="disabled">
          {category && category.name}
        </button>
      </div>

      {recipes && recipes.map(recipe => <h4>{recipe.name}</h4>)}
    </div>
  );
};

export default IngredientScreen;
