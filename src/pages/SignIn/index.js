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

        <FontAwesome5 name="earlybirds" size={60} color="black" />
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
          <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.text5}>Ainda nao tem uma conta?</Text>
            <Text style={styles.text5}>Cadastre-se aqui.</Text>
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
    width: 200,
    height: 50,
    borderRadius: 200,
    backgroundColor: '#852eff'
  }

})