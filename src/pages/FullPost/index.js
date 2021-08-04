import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, Keyboard, FlatList, ScrollView } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, Appbar, TextInput } from 'react-native-paper';
import firebase from '../../../services/firebase';
import * as ImagePicker from 'expo-image-picker'
import { AuthContext } from '../../contexts/auth';
import { format, set } from 'date-fns';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Entypo, MaterialIcons, FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import CommentList from '../CommentsList';

export default function FullPost({ route }) {

    var b = []
    const { user } = useContext(AuthContext);
    const { id, userId } = route.params;
    const navigation = useNavigation();
    const video = React.useRef(null);
    const [tipo, setTipo] = useState(' ');
    const [imgr, setImgr] = useState('');
    const [url, setUrl] = useState(null);
    const [search, setSearch] = useState('');
    const [desc, setDesc] = useState('');
    const [autor, setAutor] = useState('');
    const [username, setUsername] = useState('');
    const [like, setLike] = useState(0);
    const [postArray, setPostArray] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal, setModal] = useState(false);
    const [response, setResponse] = useState('');
    const [comment, setComment] = useState('');
    const [results, setResults] = useState([]);
    const [comments, setComments] = useState('');
    const [name, setName] = useState('');
    const [userb, setUserb] = useState('');
    const [kok, setKok] = useState('');
    const [out, setOut] = useState('');

    var urid;

    const renderItem = ({ item }) => (
        console.log(item),
        <CommentList data={item} />
    );


    useEffect(() => {
        async function tryData() {
            await firebase
                .database()
                .ref('posts')
                .on('value', (snapshot) => {
                    snapshot.forEach((machine) => {
                        if (id === machine.val().id) {
                            let post = {
                                type: machine.val().tipo,
                                imgr: machine.val().imgr,
                                desc: machine.val().description,
                                autor: machine.val().autor,
                                likes: machine.val().likes,
                                username: machine.val().username,
                                response: machine.val().response,
                                comments: machine.val().comments
                            };
                            setTipo(post.type)
                            setImgr(post.imgr)
                            setDesc(post.desc)
                            setAutor(post.autor)
                            setLike(post.likes)
                            setUsername(post.username)
                            setResponse(post.response)
                            setComments(post.comments)
                        }
                    });
                });
        }

        async function tryComment() {
            await firebase
                .database()
                .ref('comments')
                .on('value', (snapshot) => {
                    setResults([]);
                    snapshot.forEach((machine) => {
                        let cheese = {
                            comment: machine.val().comment,
                            data: machine.val().data,
                            id: machine.val().id,
                            userId: machine.val().userId,
                            cId: machine.val().cId
                        };
                        var spliteData = cheese.data
                        var spliteData_b

                        spliteData = spliteData.split('T');
                        spliteData_b = spliteData[0].split('/');
                        spliteData = spliteData[1].split(':');

                        var mydate = new Date(spliteData_b[2], spliteData_b[1] - 1, spliteData_b[0], spliteData[0] - 3, spliteData[1]);



                        cheese = {
                            comment: cheese.comment,
                            data: mydate,
                            id: cheese.id,
                            userId: cheese.userId,
                            cId: cheese.cId
                        }
                        urid = cheese.userId 
                        setResults((oldArray) => [...oldArray, cheese]);

                    });
                });

        }


        async function load() {
            try {
                if (response != '') {
                    setUrl(response);
                } else {
                    let response = await firebase.storage().ref('image').child(imgr).getDownloadURL();
                    setUrl(response);
                    await firebase.database().ref('posts').child(id).update({ response: response });
                    console.log('response', response)
                }
            } catch (err) {
                console.log('Nenhuma foto foi encontrada.');
            }
        }

        async function loadUser() {
            let response = await firebase.storage().ref('userPic').child(kok).getDownloadURL();
            setOut(response)
        }

        async function tryUser() {
            await firebase
                .database()
                .ref('users')
                .on('value', (snapshot) => {
                    snapshot.forEach((machine) => {
                        if (userId === machine.val().id) {
                            let user = {
                                postLiked: machine.val().postLiked,
                                name: machine.val().name,
                                user: machine.val().user,
                                userPic: machine.val().userPic
                            };
                            setPostArray(user.postLiked);
                            setName(user.name);
                            setUserb(user.user);
                            setKok(user.userPic)
                        }
                    });
                });
        }
        tryComment()
        tryUser()
        load()
        loadUser()
        tryData()
    }, []);


    function updateComment() {
        firebase.database().ref('posts').child(id).update({
            comments: results.length + 1
        })
    }

    function undo() {
        if (userId == user.uid) {
            return (<TouchableOpacity style={{ marginLeft: 290, marginTop: 10 }} onPress={() => { setModalVisible(!modalVisible) }}>
                <FontAwesome5 name="edit" size={24} color="#852eff" />
            </TouchableOpacity>)
        }
    }

    function filtro(value) {
        if (search === '') {
            return value;
        } else {
            var str = value.comment
            if (str.match(search)) {
                return value;
            }
        }
    }

    function compare(a, b) {
        return a.data < b.data;
    }

    function imgOrVdo() {
        if (tipo == 'video') {
            return (<Video
                ref={video}
                style={styles.video}
                source={{
                    uri: response,
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
            />)
        } else if (tipo == 'image') {
            return (

                <Image
                    style={styles.imageBox}
                    source={{
                        uri: response
                    }}></Image>
            )
        }
    }
    var dNow = new Date();
    var localdate = dNow.getDate() + '/' + (dNow.getMonth() + 1) + '/' + dNow.getFullYear() + 'T' + dNow.getHours() + ':' + dNow.getMinutes();
    async function publishComment() {
        setModal(!modal)
        let machine = await firebase.database().ref('comments');
        let chave = machine.push().key;
        machine.child(chave).set({
            userId: user.uid,
            id: id,
            comment: comment,
            data: localdate,
            cId: chave
        }).then(() => {
            Keyboard.dismiss();
            setTitulo('');
            setDescricao('');
            setTipo('');

            console.log("Data abaixo:", data)
        }).catch((error) => { console.log('err', error) })
        updateComment()
    }

    function likedOrNot() {
        var x = postArray
        if (x.indexOf(id) > -1 && like > 0) {
            return (
                <View>
                    <TouchableOpacity onPress={updateToDown} style={styles.likebutton}>
                        <Ionicons name="heart" size={20} color="#fff" />
                        <Text style={styles.like}>{like}</Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (postArray.includes(id) == false) {
            return (
                <View>
                    <TouchableOpacity onPress={updateToUp} style={styles.likebutton}>
                        <Ionicons name="heart-outline" size={20} color="#fff" />
                        <Text style={styles.like}>{like}</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    async function updateToUp() {
        await firebase.database().ref('posts').child(id).update({ likes: like + 1 })
            .then(() => { console.log('Likes atualizados.') })
        console.log('PostArray 1:', postArray)
        var arry = postArray;
        arry.push(id)
        setPostArray(arry)
        await firebase.database().ref('users').child(userId).update({ postLiked: postArray })
            .then(() => { console.log('Posts curtidos atualizados.') })
    }

    async function updateToDown() {
        await firebase.database().ref('posts').child(id).update({ likes: like - 1 })
            .then(() => { console.log('Likes atualizados.') })
        var estados = postArray;
        var buscar = id;
        var indice = estados.indexOf(buscar);
        estados.splice(indice)
        setPostArray(estados)
        await firebase.database().ref('users').child(userId).update({ postLiked: postArray })
            .then(() => { console.log('Posts curtidos atualizados.') })
    }
    return (
        <>
            <View>
                <View style={styles.header}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Appbar.BackAction color="#852eff" onPress={() => navigation.goBack()} />
                        <Text style={styles.title}>Post</Text>
                    </View>
                    {undo()}
                </View>
            </View>
            <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <Modal
                        visible={modalVisible}
                        animationType={'slide'}

                    >
                        <View style={styles.container}>
                            <TextInput
                                style={styles.txtInput}
                                mode='outlined'
                                theme={{ colors: { primary: '#f7f7f7' } }}
                                autoCorrect={false}
                                placeholder="Descrição"
                                autoCapitalize="sentences"
                                outlineColor="white"
                                selectionColor="black"
                                onChangeText={(text) => setDesc(text)}
                                multiline={true}
                                numberOfLines={8}
                            ></TextInput>
                            <TouchableOpacity onPress={() => { setModalVisible(!modalVisible) }}>
                                <MaterialIcons name="cancel" size={45} color="#852eff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(!modalVisible), firebase.database().ref('posts').child(id).update({
                                    description: desc
                                })
                            }}>
                                <Entypo name="arrow-with-circle-up" size={40} color="#852eff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Home'), firebase.database().ref('posts').child(id).remove(),
                                    firebase.storage().ref(tipo).child(imgr).delete()
                            }}>
                                <Ionicons name="ios-trash-bin" size={40} color="#852eff" />
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal
                        visible={modal}
                        animationType={'slide'}

                    >
                        <View style={styles.container}>
                            <TextInput
                                style={styles.txtInput}
                                mode='outlined'
                                theme={{ colors: { primary: '#f7f7f7' } }}
                                autoCorrect={false}
                                placeholder="Comente sobre o post"
                                autoCapitalize="sentences"
                                outlineColor="white"
                                selectionColor="black"
                                onChangeText={(text) => setComment(text)}
                                multiline={true}
                                numberOfLines={3}
                            ></TextInput>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { setModal(!modal) }}>
                                    <MaterialIcons name="cancel" size={45} color="#852eff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    publishComment()
                                }}>
                                    <Ionicons name="checkmark-circle-outline" size={45} color="#852eff" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </Modal>
                    <TouchableOpacity onPress={() => { navigation.navigate('OtherUser'),  urid}}>
                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20, marginRight: 250 }}>
                            <Image
                                style={styles.profileImg}
                                source={{
                                    uri: out
                                }}></Image>
                            <View>
                                <Text style={styles.name}>{name}</Text>
                                <Text style={styles.user}>@{userb}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Paragraph style={{ marginRight: 350, marginTop: 10, marginBottom: 10, textAlign: 'justify' }}>{desc}</Paragraph>
                    {imgOrVdo()}
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        {likedOrNot()}
                        <TouchableOpacity onPress={() => { setModal(!modal) }} style={styles.likebutton}>
                            <FontAwesome name="comments" size={24} color='white' />
                            <Text style={styles.like}>{comments}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerRow}>
                        <TextInput
                            style={styles.txtInput}
                            mode='outlined'
                            theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
                            autoCorrect={false}
                            placeholder="Buscar comentário"
                            autoCapitalize="sentences"
                            outlineColor="white"
                            selectionColor="black"
                            onChangeText={(text) => setSearch(text)}
                        >
                        </TextInput>
                    </View>

                    <FlatList
                        data={results.filter(filtro).sort(compare)}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />

                </View>
            </ScrollView>
        </>
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
    txtInput: {
        width: 380,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "flex-start",
        textAlign: 'justify',
        paddingTop: 2.5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    likebutton: {
        marginTop: 10,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        height: 50,
        width: 190,
        borderRadius: 200,
        backgroundColor: '#852eff'
    },
    likedRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    header: {
        display: 'flex',
        alignContent: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 50, shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageBox: {
        width: 400,
        height: 400,
        borderRadius: 25,
    },
    imageModal: {
        width: 400,
        height: 400,
        marginTop: 150
    },
    txt: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 25,
        marginLeft: 5
    },
    name: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 5
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    user: {
        color: '#000',
        fontSize: 15,
        marginLeft: 5,
        fontStyle: 'italic'
    },
    like: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 5,
        marginBottom: 2
    },
    txt_b: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10
    },
    title: {
        color: '#852eff',
        fontWeight: 'bold',
        fontSize: 23,
        marginTop: 7.5
    },
    video: {
        alignSelf: 'center',
        width: 400,
        height: 400,
        borderRadius: 25
    },
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '97%'

    },
    qtdTxt: {
        color: '#852eff',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 4,
        marginTop: 4
    },
    rowBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    }

})