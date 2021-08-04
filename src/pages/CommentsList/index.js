import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../../services/firebase';
import { FontAwesome5, FontAwesome, MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/auth';

export default function CommentList({ data }) {

    const [modal, setModal] = useState(false);
    const [c, setC] = useState('');
    const { user } = useContext(AuthContext);
    const [userdata, setUserData] = useState({});
    const [name, setName] = useState('');
    const [usera, setUsera] = useState('');

    useEffect(()=>{
        async function userList() {
            await firebase
              .database()
              .ref('users')
              .on('value', (snapshot) => {
                setUserData({})
                snapshot.forEach((machine) => {
                    if(data.userId == machine.val().id){
                        let user = {
                        name: machine.val().name,
                        user: machine.val().user
                        }
                        setName(user.name)
                        setUsera(user.user)
                    }
                });
              });
          }
          userList()
    },[])


    var cId = data.cId;



    function mineOrNot() {
        if (data.userId = user.uid) {
            return (
                <TouchableOpacity onPress={() => { setModal(!modal) }} style={{marginLeft: 250}}>
                    <FontAwesome5  name="edit" size={20} color="#852eff" />
                </TouchableOpacity>
            )
        }
    }

    return (
        <View>
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
                        placeholder="Editar o comentário"
                        autoCapitalize="sentences"
                        outlineColor="white"
                        selectionColor="black"
                        onChangeText={(text) => setC(text)}
                        multiline={true}
                        numberOfLines={3}
                    ></TextInput>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>

                        <TouchableOpacity onPress={() => { setModal(!modal) }}>
                            <MaterialIcons name="cancel" size={45} color="#852eff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModal(!modal), firebase.database().ref('comments').child(cId).update({
                                comment: c
                            })
                        }}>
                            <Entypo name="arrow-with-circle-up" size={40} color="#852eff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            firebase.database().ref('comments').child(cId).remove()
                        }}>
                            <Ionicons name="ios-trash-bin" size={40} color="#852eff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.txt}>{name}</Text>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                        <Text style={styles.txt_b}>{'@' + usera}</Text>
                        {mineOrNot()}
                    </View>
                    <Paragraph>{data.comment}</Paragraph>
                </Card.Content>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 5,
        marginLeft: '3%',
        marginRight: '3%',
        marginTop: '1.5%',
        marginBottom: '1.5%',
        width: 350
    },
    txt: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    txt_b: {
        fontSize: 10,
        fontStyle: 'italic'
    },
    qtdTxt: {
        color: '#852eff',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 4,
        marginTop: 4
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgBox: {
        width: 345,
        height: 250,
        overflow: 'hidden',
        borderRadius: 10,
        marginTop: 4
    },
    rowBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 10
    }, txtInput: {
        width: 400
    }

})