import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { TextInput } from 'react-native-paper';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../../services/firebase'
import * as ImagePicker from 'expo-image-picker'


export default function SignUp() {

  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_a, setPassword_a] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [user_exist, setUser_exist] = useState([]);
  const [image, setImage] = useState(null);
  const [userPic, setUserPic] = useState('');


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
        const postLiked = ['onlyaholder']
        console.log('userPic: ', userPic)
        uploadImg()
        if (user_exist.includes(user)) {
          ToastAndroid.show("Nome de usuário já em uso.", ToastAndroid.LONG);
        } else if (email !== '' && password !== '' && name !== '' && user !== '' && bio !== '' && userPic !== '') {
          uploadImg()
          signUp(email, password, name, user, bio, userPic, postLiked)
        }
      } else {
        ToastAndroid.show("As senhas não são iguais.", ToastAndroid.LONG);
      }
    }


  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImg = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);

      };
      xhr.onerror = function () {
        reject(new TypeError('Request falhou.'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });



    const ref = firebase.storage().ref().child('userPic/' + new Date().toISOString());
    console.log('ref', ref)
    let a = ref.fullPath.split('/');
    let b = a[1]
    console.log(b)
    setUserPic(a[1])
    console.log('ok: ', userPic)
    const snapshot = ref.put(blob);

    snapshot.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
      setUpLoading(true)
    }, (error) => {
      setUpLoading(false)
      console.log(error)
      blob.close();
      return
    }, () => {
      snapshot.ref.getDonwloadURl().then((url) => {
        setUpLoading(false)
        console.log('download', url);
        blob.close();
        return url;
      })
    });
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
          autoCapitalize="none"
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
          autoCapitalize="none"
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
          autoCapitalize="none"
          outlineColor="white"
          selectionColor="black"
          onChangeText={(text) => setPassword_a(text)}
        ></TextInput>
        <View style={styles.displayBox}>
          <Image
            style={styles.imageBox}
            source={{
              uri: image
            }}></Image>
          <TouchableOpacity style={styles.pick} onPress={pickImage}>
            <Text style={styles.txt}>Escolha uma foto</Text>
          </TouchableOpacity>
        </View>


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
  imageBox: {
    width: 200,
    height: 200,
    borderRadius: 300
  },
  displayBox: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
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
  },
  pick: {
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