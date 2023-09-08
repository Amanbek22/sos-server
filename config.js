const { initializeApp } = require("firebase/app");

const firebaseConfig = {
  apiKey: "AIzaSyDTd5ZTKS77WvQjHshKXckSiOc69iq3vS4",
  authDomain: "soskg-d8da5.firebaseapp.com",
  databaseURL: "https://soskg-d8da5-default-rtdb.firebaseio.com",
  projectId: "soskg-d8da5",
  storageBucket: "soskg-d8da5.appspot.com",
  messagingSenderId: "899549071789",
  appId: "1:899549071789:web:310d2f14dad07efbccb924",
  measurementId: "G-QKCSX8WXEC",
};

const app = initializeApp(firebaseConfig);

module.exports = app;
