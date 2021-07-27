import firebase from 'firebase';
// import 'firebase/auth';
// import 'firebase/database';
// import 'firebase/storage';

import firestore from 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAOIGFyuuipOrL_zbb0r90AsMUru1vCRYg",
  authDomain: "el-piador-61ccd.firebaseapp.com",
  databaseURL: "https://el-piador-61ccd-default-rtdb.firebaseio.com",
  projectId: "el-piador-61ccd",
  storageBucket: "el-piador-61ccd.appspot.com",
  messagingSenderId: "575554087805",
  appId: "1:575554087805:web:79b40c0269bb9d07ff3a14",
  measurementId: "G-HLYXVR7R5Q"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.firestore();
export default firebase;