import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Stories from "./views/Stories";
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route exact path="/" component={Stories} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
