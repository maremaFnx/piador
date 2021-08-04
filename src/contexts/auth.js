import React, {useState, createContext, useEffect} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../services/firebase';

export const AuthContext = createContext({});

function AuthProvider({children}) {
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    async function loadStorage() {
      const storageUser = await AsyncStorage.getItem('Auth_user');

      if (storageUser) {
        setUser(JSON.parse(storageUser));
      
      }

    }

    loadStorage();
  }, []);


  async function signIn(email, password) {
   
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await firebase
          .database()
          .ref('users')
          .child(uid)
          .once('value')
          .then((snapshot) => {
              let data = {
                uid: uid,
                name: snapshot.val().name,
                bio: snapshot.val().bio,
                email: value.user.email,
                user: snapshot.val().user,
                password: snapshot.val().password
              };
              setUser(data);
              storageUser(data);
            
      })
      .catch(() => {
        alert('');
      });

  
    })
  }

  async function signUp(email, password, name, user, bio, userPic, postLiked) {

      await firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(async (value) => {
              let uid = value.user.uid;
              await firebase.database().ref('users').child(uid).set({
                  name: name,
                  email: value.user.email,
                  user: user, 
                  password: password,
                  bio: bio,
                  id: uid,
                  userPic: userPic,
                  postLiked: postLiked
              })
                  .then(() => {
                      let data = {
                          uid: uid,
                          name: name,
                          user: user, 
                          password: password,
                          bio: bio,
                          id: uid,
                          userPic: userPic
                      };
                      setUser(data);
                      storageUser(data);

                  })
          })
          .catch((error) => {
              alert(error.code);
          });
  }

  async function storageUser(data) {
    await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
  }

  async function signOut() {
    await firebase.auth().signOut();
    await AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
