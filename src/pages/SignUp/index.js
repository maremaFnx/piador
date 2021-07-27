import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../../services/firebase'


export default function SignUp() {

  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_a, setPassword_a] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [user_exist, setUser_exist] = useState([]);

  useEffect(() => {
    firebase
      .database()
      .ref('users')
      .on('value', (snapshot) => {
        snapshot.forEach((userAlreadyExists) => {
          setUser_exist((oldArray) => [...oldArray, userAlreadyExists.val().user])
        }
        );
      })
  }, [])

  function cadastrar() {
    if (email == '' && password == '' && name == '' && user == '') {
      ToastAndroid.show("Preencha os campos do cadastro.", ToastAndroid.LONG);

    } else {
      if (password == password_a) {
        firebase
          .database()
          .ref('users')
          .on('value', (snapshot) => {
            snapshot.forEach((userAlreadyExists) => {
              setUser_exist((oldArray) => [...oldArray, userAlreadyExists.val().user]);
            }
            );
          })
        const bio = " "

        if (user_exist.includes(user)) {
          ToastAndroid.show("Nome de usuário já em uso.", ToastAndroid.LONG);
        } else if (email !== '' && password !== '' && name !== '' && user !== '' && bio !== '') {
          signUp(email, password, name, user, bio)
        }
      } else {
        ToastAndroid.show("As senhas não são iguais.", ToastAndroid.LONG);
      }
    }


  }




  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.txt_title_b}>Preencha seu cadastro para acessar a plataforma:</Text>
        </View>
        <TextInput
          style={styles.txtInput}
          mode='outlined'
          theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
          autoCorrect={false}
          placeholder="Nome"
          autoCapitalize="sentences"
          outlineColor="white"
          selectionColor="black"
          onChangeText={(text) => setName(text)}
        ></TextInput>

        <TextInput
          style={styles.txtInput}
          mode='outlined'
          theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
          autoCorrect={false}
          placeholder="E-mail"
          autoCapitalize="none"
          outlineColor="white"
          selectionColor="black"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>

        <TextInput
          style={styles.txtInput}
          mode='outlined'
          theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
          autoCorrect={false}
          placeholder="Usuário"
          autoCapitalize="sentences"
          outlineColor="white"
          selectionColor="black"
          onChangeText={(text) => setUser(text)}
        ></TextInput>

        <TextInput
          style={styles.txtInput}
          mode='outlined'
          theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
          autoCorrect={false}
          placeholder="Senha"
          secureTextEntry={true}
          autoCapitalize="sentences"
          outlineColor="white"
          selectionColor="black"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>

        <TextInput
          style={styles.txtInput}
          mode='outlined'
          theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
          autoCorrect={false}
          secureTextEntry={true}
          placeholder="Confirme a senha"
          autoCapitalize="sentences"
          outlineColor="white"
          selectionColor="black"
          onChangeText={(text) => setPassword_a(text)}
        ></TextInput>

        <TouchableOpacity style={styles.sbmt_btn} onPress={cadastrar}>
          <Text style={styles.txt}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 30,
    left: 7
  },
  box: {
    width: 350
  },
  txtInput: {
    width: 400,
    height: 50,
    marginTop: 5,
    marginBottom: 5
  },
  txt: {
    color: 'white',
  },
  txt_title: {
    color: 'black',
  },
  txt_title_b: {
    color: 'black',
    fontSize: 25,
    textAlign: 'left'
  },
  sbmt_btn: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    width: 400,
    height: 50,
    borderRadius: 200,
    backgroundColor: '#852eff'
  }

})