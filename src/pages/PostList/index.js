import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../../services/firebase';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';

export default function PostList({ data }) {

    const navigation = useNavigation();
    const [url, setUrl] = useState(null);
    var id = data.id;
    var userId = data.userId;


    useEffect(() => {
        async function load() {
            if (data.response != null && data.response != '') {
                setUrl(data.response);
            }
            console.log('imgr: ', data.img)
            try {
                let response = await firebase.storage().ref('image').child(data.img).getDownloadURL();
                setUrl(response);
                await firebase.database().ref('posts').child(id).update({response: response})
                console.log('response', response)
            } catch (err) {
                console.log('Nenhuma foto foi encontrada.');
            }
        }
        load();
    }, []);

    return (
        <View>
            <TouchableOpacity onPress={() => { navigation.navigate('FullPost', { id, userId }) }}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.txt}>{data.nome}</Text>
                        <Text style={styles.txt_b}>{'@' + data.usuario}</Text>
                        <Paragraph>{data.descricao}</Paragraph>
                        <Image style={styles.imgBox} source={{ uri: url }}></Image>
                        <View style={styles.rowBox}>
                            <View style={{ display: 'flex', flexDirection: 'row', marginRight: 10 }}>
                                <FontAwesome name="comment" size={24} color='#852eff' />
                                <Text style={styles.qtdTxt}>{data.comments}</Text>
                            </View>
                            <View style={{ display: 'flex', flexDirection: 'row', }}>
                                <FontAwesome name="heart" size={24} color='#852eff' />
                                <Text style={styles.qtdTxt}>{data.like}</Text>
                            </View>

                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
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
        marginBottom: '1.5%'
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
    }
})