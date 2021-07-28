import React, { useState, useContext } from 'react';
import { ImageBackground, View, Text, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext)
  function login() {
    signIn(email, password)
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 40 }}>
        <FontAwesome5 name="earlybirds" size={120} color="#852eff" />
      </View>
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
      >
      </TextInput>
      <TextInput
        style={styles.txtInput}
        mode='outlined'
        theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
        autoCorrect={false}
        secureTextEntry={true}
        placeholder="Senha"
        autoCapitalize="none"
        outlineColor="white"
        selectionColor="black"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      >
      </TextInput>
      <View style={styles.container}>

        <TouchableOpacity style={styles.sbmt_btn} onPress={login}>
          <Text style={styles.txt}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.singup} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.singupTxt}>Ainda nao tem uma conta?</Text>
          <Text style={styles.singupTxt}>Cadastre-se aqui.</Text>
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
    backgroundColor: '#fff'
  },
  box: {
    width: 350
  },
  logo: {
    color: '#852eff',
    width: 100,
  },
  txtInput: {
    width: 350,
    height: 50,
    marginTop: 5,
    marginBottom: 5,
    
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
    width: 200,
    height: 50,
    borderRadius: 200,
    backgroundColor: '#852eff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  singup: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  singupTxt: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
  },
  txt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }


})