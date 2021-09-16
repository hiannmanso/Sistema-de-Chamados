
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import 'firebase/compat/storage'



const firebaseConfig = {
  apiKey: "AIzaSyBBOLKuwcW02QkMH2DQMk11oOQbw7O-FLI",
  authDomain: "sistema-76ee9.firebaseapp.com",
  projectId: "sistema-76ee9",
  storageBucket: "sistema-76ee9.appspot.com",
  messagingSenderId: "874914221717",
  appId: "1:874914221717:web:c739021c41e4bdf562959c",
  measurementId: "G-FLQQZ8F476"
};


// Initialize Firebase
if (!firebase.apps.length){
   firebase.initializeApp(firebaseConfig);
  }
  

export default firebase;