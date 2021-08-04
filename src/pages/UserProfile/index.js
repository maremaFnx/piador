import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, Keyboard, FlatList, ScrollView, ToastAndroid } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, TextInput } from 'react-native-paper';
import firebase from '../../../services/firebase';
import * as ImagePicker from 'expo-image-picker'
import { AuthContext } from '../../contexts/auth';
import { format, set } from 'date-fns';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Entypo, MaterialIcons, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import PostList from '../PostList';


export default function UserProfile() {

    const { user } = useContext(AuthContext);
    const [url, setUrl] = useState('');
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_a, setPassword_a] = useState('');
    const [userUp, setUserUp] = useState('');
    const [user_exist, setUser_exist] = useState([]);
    const [bio, setBio] = useState('');
    const [userPic, setUserPic] = useState('')
    const [image, setImage] = useState('');

    function cadastrar() {
        if (email == '' && password == '' && name == '' && userUp == '') {
            ToastAndroid.show("Preencha os campos para atualizar seus dados.", ToastAndroid.LONG);

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
                } else if (email !== '') {
                    uploadImg()
                    update()
                    setModal(!modal)

                }
            } else {
                console.log(password)
                console.log(password_a)
                ToastAndroid.show("As senhas não são iguais.", ToastAndroid.LONG);
            }
        }


    }
    function update() {
        firebase.database().ref('users').child(user.id).update({
            bio: bio,
            email: email,
            id: user.id,
            name: name,
            password: password,
            user: userUp,
            userPic: userPic

        })
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
        setUserPic(b)
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
    useEffect(() => {
        async function load() {
            try {
                let response = await firebase.storage().ref('userPic').child('2021-08-03T19:54:48.919Z').getDownloadURL();
                setUrl(response);
                console.log('response', response)
            } catch (err) {
                console.log('Nenhuma foto foi encontrada.');
            }
        }
        async function postList() {
            await firebase
                .database()
                .ref('posts')
                .on('value', (snapshot) => {
                    snapshot.forEach((machine) => {
                        if (user.id === machine.val().userId) {
                            setResults([])
                            let post = {
                                descricao: machine.val().description,
                                nome: machine.val().autor,
                                usuario: machine.val().username,
                                img: machine.val().imgr,
                                like: machine.val().likes,
                                id: machine.val().id,
                                userId: machine.val().userId,
                                response: machine.val().response,
                                data: machine.val().data,
                            };
                            var spliteData = post.data
                            var spliteData_b

                            spliteData = spliteData.split('T');
                            spliteData_b = spliteData[0].split('/');
                            spliteData = spliteData[1].split(':');

                            var mydate = new Date(spliteData_b[2], spliteData_b[1] - 1, spliteData_b[0], spliteData[0] - 3, spliteData[1]);
                            var descricao = post.descricao
                            var nome = post.nome
                            var usuario = post.usuario
                            var img = post.img
                            var like = post.like
                            var id = post.id
                            var userId = post.userId
                            var response = post.response
                            var data = mydate

                            post = {
                                descricao: post.descricao,
                                nome: post.nome,
                                usuario: post.usuario,
                                img: post.img,
                                like: post.like,
                                id: post.id,
                                userId: post.userId,
                                response: post.response,
                                data: mydate
                            }
                            setResults((oldArray) => [...oldArray, post]);

                        }
                    });
                });
        }
        postList()
        load();
    }, []);

    const renderItem = ({ item }) => (
        <PostList data={item} />
    );

    function filtro(value) {
        if (search === '') {
            return value;
        } else {
            var str = value.descricao
            if (str.match(search)) {
                return value;
            }
        }
    }

    function compare(a, b) {
        return a.data < b.data;
    }

    return (
        <View style={styles.container}>
            <Modal
                visible={modal}
                animationType={'slide'}
                style={styles.container}
            >
                <View style={styles.container}>
                    <Text style={styles.txt}>Atualize seus dados:</Text>
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
                        onChangeText={(text) => setUserUp(text)}
                    ></TextInput>

                    <TextInput
                        style={styles.txtInput}
                        mode='outlined'
                        theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
                        autoCorrect={false}
                        placeholder="Biografia"
                        autoCapitalize="none"
                        outlineColor="white"
                        selectionColor="black"
                        onChangeText={(text) => setBio(text)}
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
                                uri: url
                            }}></Image>
                        <TouchableOpacity style={styles.pick} onPress={pickImage}>
                            <Text style={styles.txtBold}>Escolha uma foto</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={styles.pick} onPress={cadastrar}>
                        <Text style={styles.txtBold}>Atualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.pick} onPress={() => {setModal(!modal)}}>
                        <Text style={styles.txtBold}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Text style={styles.txt}>{user.name}</Text>
            <Image
                style={styles.profile}
                source={{ uri: url }}
            />
            <Text style={styles.txt}>@{user.user}</Text>
            <Text style={styles.txt}>{bio}</Text>
            <TextInput

                style={styles.txtInput}
                mode='outlined'
                theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
                autoCorrect={false}
                placeholder="Buscar"
                autoCapitalize="sentences"
                outlineColor="white"
                selectionColor="black"
                onChangeText={(text) => setSearch(text)}
            >

            </TextInput>
            <TouchableOpacity onPress={() => { setModal(!modal) }} style={{ marginLeft: 250 }}>
                <FontAwesome5 name="edit" size={20} color="#852eff" />
            </TouchableOpacity>
            <ScrollView>
                <FlatList
                    data={results.filter(filtro).sort(compare)}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    txtInput: {
        width: 340,
        height: 50,
        marginTop: 5,
        marginBottom: 5
    },
    txt: {
        fontWeight: 'bold',
        fontSize: 25,
        color: '#852eff'
    },
    profile: {
        width: 150,
        height: 150,
        borderRadius: 200,
        borderColor: '#E0E0E0',
        borderWidth: 1
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
    },
    txtBold:{
        fontWeight: 'bold',
        fontSize: 25,
        color: '#fff'   
    }
});