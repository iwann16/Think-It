import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  //login function
  const login = (provider) => {
    return auth.signInWithPopup(provider).then((cred) => {
      db.collection("Users")
        .doc(cred.user.uid)
        .get()
        .then((docSnapshot) => {
          if (!docSnapshot.exists) {
            db.collection("Users").doc(cred.user.uid).set({
              username: cred.user.displayName,
              email: cred.user.email,
              profilePic: cred.user.photoURL,
              signInWith: cred.credential.signInMethod,
              userId: cred.user.uid,
              posts: [],
              joinedAt: new Date(),
            });
          }
        });
    });
  };

  //logout function
  const logout = () => {
    return auth.signOut();
  };

  //delete user
  const userDelete = () => {
    return auth.currentUser.delete();
  };

  //delete user document
  const userDocDelete = (postId) => {
    return db.collection("Users").doc(postId).delete();
  };

  //delete users posts
  const deletePostsIfUserDeletesAccount = () => {
    return db
      .collection("Posts")
      .where("userId", "==", currentUser.uid)
      .get()
      .then((snapShot) => {
        snapShot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  };

  //delete certain users post
  const deletePost = (postId) => {
    return db.collection("Posts").doc(postId).delete();
  };

  //set authed user to the current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    userDelete,
    deletePostsIfUserDeletesAccount,
    deletePost,
    userDocDelete,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
