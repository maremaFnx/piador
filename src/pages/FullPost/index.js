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

export default function FullPost(route) {

    const { pid, urid } = route.params;
    const navigation = useNavigation();
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const [tipo, setTipo] = useState(' ');
    const [image, setImage] = useState(null);
    const [pub, setPub] = useState({});
    const [user, setUser] = useState({});

    console.log('pid:' , pid)
    console.log('urid:', urid)
    useEffect(() => {
        async function tryData() {
          await firebase
            .database()
            .ref('posts')
            .on('value', (snapshot) => {
              snapshot.forEach((machine) => {
                if (data.id === machine.val().id) {
                  let post = {
                    
                  };
                }
              });
            });
        }
        // async function tryUserInit() {
        //   await firebase
        //     .database()
        //     .ref('users')
        //     .on('value', (snapshot) => {
        //       snapshot.forEach((children) => {
        //         if (data.urid === children.val().userId) {
        //           let cheese = {
        //             name: cheese.val().name,
        //           }
        //           console.log('cheese:', cheese)
        //         }
        //       });
        //     });
        // }
        // tryUserInit()
        tryData()
      }, [])
  
   
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

   
    return (
        <>
            <View>
                <View style={styles.header}>
                    <Appbar.BackAction color="#852eff" onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Post</Text>
                </View>
            </View>
            <View style={styles.container}>
             
                <View>
                    {imgOrVdo()}
                </View>
                
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