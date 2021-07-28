import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ToastAndroid, Button } from 'react-native';
import { Appbar, TextInput } from 'react-native-paper';
import firebase from '../../../services/firebase';
import * as ImagePicker from 'expo-image-picker'
import { AuthContext } from '../../contexts/auth';
import { format } from 'date-fns';
import { FontAwesome5 } from '@expo/vector-icons';
import { Video, AVPlaybackStatus } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

export default function PostAdd() {

    const [uriString, setUriString] = useState(' ');
    const navigation = useNavigation()
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [tipo, setTipo] = useState(' ');
    const [image, setImage] = useState(null);
    const [upLoading, setUpLoading] = useState(null);
    const [multiline, setMultiline] = useState(true)

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.type == 'image') {
            setTipo('image')
        } else if (result.type == 'video') {
            setTipo('video')
        } else {
            setTipo('misc')
        }
        console.log(result);

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



        const ref = firebase.storage().ref().child(tipo + '/' + new Date().toISOString());
        let gugu = ref.fullPath.split('/');
        let vick = gugu[1]
        setUriString(vick)
        console.log('STRING:',uriString)
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

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const { user } = useContext(AuthContext);


    async function publish() {


        if (description !== '') {
            let machine = await firebase.database().ref('posts');
            let chave = machine.push().key;

            machine.child(chave).set({
                description: description,
                autor: user.name,
                imgr: uriString,
                likes: 0,
                tipo: tipo,
                userId: user.uid,
                id: chave,
                username: user.user
            }).then(() => {
                Keyboard.dismiss();
                setTitulo('');
                setDescricao('');
                setTipo('');

                console.log("Data abaixo:", data)
            }).catch((error) => { console.log('err', error) })
        } else {

        }
    }

    function imgOrVdo() {
        if (tipo == 'video') {
            return (<Video
                ref={video}
                style={styles.video}
                source={{
                    uri: image,
                }}
                useNativeControls
                resizeMode="contain"
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />)
        } else if (tipo == 'image') {
            return (<Image
                style={styles.imageBox}
                source={{
                    uri: image
                }}></Image>)
        }
    }

    function double() {
        if (description) {
            if (image) {
                console.log(description);
                console.log('imagem', image)
                publish();
                uploadImg();
                setImage(null);
                navigation.navigate('Home');
            } else {
                ToastAndroid.show("Você não selecionou a imagem.", ToastAndroid.LONG);
            }
        } else {
            ToastAndroid.show("Você não inseriu a descrição.", ToastAndroid.LONG);
        }

    }
    return (
        <>
            <View>
                <View style={styles.header}>
                    <Appbar.BackAction color="#852eff" onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Nova publicação:</Text>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.bck}>
                <TextInput
                    style={styles.txtInput}
                    mode='outlined'
                    
                    theme={{ colors: { primary: '#f7f7f7'  }}}
                    autoCorrect={false}
                    placeholder="Descrição"
                    autoCapitalize="sentences"
                    outlineColor="white"
                    selectionColor="black"
                    onChangeText={(text) => setDescription(text)}
                    multiline={multiline}
                    numberOfLines={8}
                ></TextInput>
                </View>
                <View>
                    {imgOrVdo()}
                </View>
                <View style={styles.box}>
                    <TouchableOpacity style={styles.gBtn} onPress={pickImage}>
                        <FontAwesome5 name="photo-video" size={24} color="white" />
                        <Text style={styles.txt_b}>Selecionar arquivo da galeria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sbmt_btn} onPress={double}>
                        <Text style={styles.txt}>Publicar</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sbmt_b} onPress={() => {navigation.navigate('Camera')}}>
                        <FontAwesome5 name="camera" size={24} color="white" />
                        <Text style={styles.txt}>Tirar uma foto</Text>
                    </TouchableOpacity>

            </View>
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
    box: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageBox: {
        width: 400,
        height: 400,
        borderRadius: 25
    },
    txtInput: {
        width: 380,
        marginTop: 5,
        marginBottom: 5,
        justifyContent: "flex-start",
        textAlign:'justify',
        paddingTop: 2.5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10
    },
    txt: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
        marginLeft:5
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
    }, video: {
        alignSelf: 'center',
        width: 400,
        height: 400,
        borderRadius: 25
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sbmt_btn: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        width: 155,
        height: 50,
        borderRadius: 200,
        backgroundColor: '#852eff'
    },
    bck:{
        backgroundColor: '#f7f7f7',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 10
    },
    sbmt_b: {
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
    gBtn: {
        marginTop: 10,
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        width: 235,
        height: 50,
        borderRadius: 200,
        backgroundColor: '#852eff'
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },

})