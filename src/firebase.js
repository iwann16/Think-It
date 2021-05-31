import firebase from "firebase";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDy2KhSyB3OzwzHqKLqo-Nih2tOJ-2ilqQ",
  authDomain: "random-d8fe2.firebaseapp.com",
  projectId: "random-d8fe2",
  storageBucket: "random-d8fe2.appspot.com",
  messagingSenderId: "914674967639",
  appId: "1:914674967639:web:ef4d456ba5feb78c86af12",
});

export const db = firebase.firestore();
export const auth = app.auth();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();

export default app;
