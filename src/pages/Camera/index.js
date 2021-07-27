import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import { Appbar, TextInput } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Cam() {

    const navigation = useNavigation()
    const camRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [capturedPhoto, setCapturedPhoto] = useState('');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    async function takePicture() {
        if (camRef) {
            const data = await camRef.current.takePictureAsync();
            console.log(data);
            setCapturedPhoto(data.uri);
            console.log(capturedPhoto)
            setOpen(true);
        }
    }

    function modalOp() {
        console.log('entrou na função')
        if(capturedPhoto){
            <Modal
            animationType='slide'
            transparent={false}
            visible={open}
            >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20}}>
                    <TouchableOpacity style={{margin: 10}} onPress={() => setOpen(false)}>
                    <Text>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        }
    }
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header}>
                    <Appbar.BackAction color="#852eff" onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Câmera</Text>
                </View>
            </View>
            <Camera ref={camRef} style={styles.camera} type={type}>
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.flip}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <FontAwesome5 name="retweet" size={40} color="#852eff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.take}
                        onPress={takePicture}>
                        <FontAwesome5 name="camera" size={60} color="#852eff" />
                    </TouchableOpacity>
                    {modalOp()}
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    flip: {
        marginTop: 20,
        marginRight: 25
    },
    take: {
        marginTop: 5,
        marginRight: 68
    },
    title: {
        color: '#852eff',
        fontWeight: 'bold',
        fontSize: 23,
        marginTop: 7.5
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
    },
    footer: {
        position: 'absolute',
        top: '87%',
        left: 17,
        backgroundColor: 'white',
        width: 380,
        height: 80,
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center'
    }
});
