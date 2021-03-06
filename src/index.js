import React from 'react';
import ReactDOM from 'react-dom';
import RhymeFinderApp from './RhymeFinderApp.js';
import 'bootstrap/dist/css/bootstrap.css';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <>
    <div className="container">
      <div>
        <a href="https://github.com/mventrice/579_ps6">
          View source code
        </a>
      </div>
      <h1 className="row">Rhyme Finder</h1>
      <RhymeFinderApp />
    </div>
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
