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


export default function OtherUser() {

    
    const [url, setUrl] = useState('');
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState(false);
    const [bio, setBio] = useState('');
    const [userPic, setUserPic] = useState('')
    const [usuari, setUsuari] = useState({});
    const [usuarioId, setUsuarioId] = useState('');

   
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
                    });
                });
        }
        postList();
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
          
            <Text style={styles.txt}>{usuari.name}</Text>
            <Image
                style={styles.profile}
                source={{ uri: url }}
            />
            <Text style={styles.txt}>@{}</Text>
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