import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IngredientScreen from './screens/IngredientScreen';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Route path="/r/ingredient/:id" component={IngredientScreen} />
        </div>
      </Router>
    );
  }
}

export default App;
