import React from 'react';
import ReactDOM from 'react-dom';

import './App.css';
import App from './App';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app';

// Add the Firebase products that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './config/firebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize your Web app as described in the Get started for Web
// Firebase previously initialized using firebase.initializeApp().

declare var location: any;
var db = firebase.firestore();
if (location.hostname === 'localhost') {
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
