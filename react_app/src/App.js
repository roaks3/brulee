import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IngredientScreen from './screens/IngredientScreen';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav class="navbar-container">
            <div class="navbar-header">
              <a href="/createList" class="navbar-logo">
                brulee
              </a>
            </div>
            <ul class="navbar-main">
              <li>
                <a href="/createList">Create List</a>
              </li>
              <li>
                <a href="/groceries">Grocery Lists</a>
              </li>
              <li>
                <a href="/addRecipes">Add Recipes</a>
              </li>
              <li>
                <a href="/ingredients">Ingredients</a>
              </li>
            </ul>
          </nav>

          <Route path="/r/ingredient/:id" component={IngredientScreen} />
        </div>
      </Router>
    );
  }
}

export default App;
