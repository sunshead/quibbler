import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

import React, { Component } from 'react';
import './App.css';

import NewsPanel from '../NewsPanel/NewsPanel';

class App extends React.Component {
  render() {
    return (
      <div>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"/>
        <div className="container">
          <NewsPanel/>
        </div>
      </div>
    );
  }
}

export default App;
