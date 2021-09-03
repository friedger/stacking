import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import 'bootstrap';
import 'bootstrap/js/dist/alert';
// Require Sass file so webpack can build it
import 'bootstrap/dist/css/bootstrap.css';

// Require Sass file so webpack can build it

ReactDOM.render(<App />, document.getElementById('react'));
