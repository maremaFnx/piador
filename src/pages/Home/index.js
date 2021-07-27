import React, { useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

export default function Home() {
  const { signOut } = useContext(AuthContext)
  return (
    <View style={styles.container}>
      <View style={styles.rowBox}>
        <FontAwesome5 name="earlybirds" size={48} color="#852eff" />
        <Text style={styles.txtBox}>Piador</Text>
      </View>
      <View style={styles.rowBox}>
        <TextInput

          style={styles.txtInput}
          mode='outlined'
          theme={{ colors: { underlineColor: 'transparent', primary: 'white' }, roundness: 200 }}
          autoCorrect={false}
          placeholder="Buscar"
          autoCapitalize="sentences"
          outlineColor="white"
          selectionColor="black"
          onChangeText={(text) => setEmail(text)}
        >

        </TextInput>
        <TouchableOpacity style={styles.searchButton}>
          <FontAwesome name="search" size={20} color="#fff" />
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
  rowBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  txtInput: {
    width: 340,
    height: 50,
    marginTop: 5,
    marginBottom: 5
  },
  txt: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25
  },
  txtBox: {
    marginTop: 10,
    marginLeft: 10,
    color: '#852eff',
    fontWeight: 'bold',
    fontSize: 25
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
  },
  searchButton: {
    marginTop: 10,
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 200,
    backgroundColor: '#852eff'
  }

})