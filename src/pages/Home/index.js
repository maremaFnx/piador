import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { AuthContext } from '../../contexts/auth';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import PostList from '../PostList';
import firebase from '../../../services/firebase';

export default function Home() {

  const [post, setPost] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('');
  const { signOut } = useContext(AuthContext);



  useEffect(() => {
    async function postList() {
      await firebase
        .database()
        .ref('posts')
        .on('value', (snapshot) => {
          setResults([]);
          snapshot.forEach((machine) => {
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
              comments: machine.val().comments
            };
            
            

            var spliteData = post.data
            var spliteData_b

           spliteData = spliteData.split('T');
           spliteData_b = spliteData[0].split('/');
           spliteData = spliteData[1].split(':');

           var mydate = new Date(spliteData_b[2], spliteData_b[1] - 1 , spliteData_b[0], spliteData[0] - 3, spliteData[1]); 
           var descricao = post.descricao
           var nome = post.nome
           var usuario = post.usuario
           var img = post.img
           var like = post.like
           var id = post.id
           var userId = post.userId
           var response = post.response
           var data =  mydate

           post = {
             descricao: post.descricao,
             nome: post.nome,
             usuario: post.usuario,
             img: post.img,
             like: post.like,
             id: post.id,
             userId: post.userId,
             response: post.response,
             data: mydate,
             comments: post.comments
           }
            setResults((oldArray) => [...oldArray, post]);
          });
        });
    }
    postList()
  }, [])

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

  function compare(a,b) {
    return a.data < b.data;
  }

  const renderItem = ({ item }) => (
    <PostList data={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.rowBox}>
        <FontAwesome5 name="earlybirds" size={48} color="#852eff" />
        <Text style={styles.txtBox}>Piador</Text>
      </View>
      <View style={styles.headerRow}>
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
      </View>

      <ScrollView style={styles.scroll}>
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
  headerRow: {
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
  }, scroll: {
    width: 400
  }

})