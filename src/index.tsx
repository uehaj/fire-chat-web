import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './config/firebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
