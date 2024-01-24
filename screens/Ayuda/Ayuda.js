import React from "react";
import { StyleSheet, Linking, View, FlatList, Text } from "react-native";
import ListItem from "./ListItem";
export default () => {
    let call = require('../../assets/telefono.png');
    let wsp = require('../../assets/whatsapp.png');
    let mail = require('../../assets/email.png');
    let yt = require('../../assets/yt.png');


    const DATA = [
    {
      id: "1",
      title: "Llamar",
      logo: call,
      link: "tel:+5492227673372",
    },
    {
      id: "2",
      title: "WhatsApp",
      logo: wsp,
      link: "http://api.whatsapp.com/send?phone=5492227673372",
    },
    {
      id: "3",
      title: "E-mail",
      logo: mail,
      link: "mailto:infofarmerin@gmail.com",
    },
  ];
  const Separator = () => (
    <View style={{ flex: 1, height: 1, backgroundColor: "#2980B9" }}></View>
    );
    const navegar = (link) => Linking.openURL(link);
  
  return (
    <View style={styles.container}>
        <View style={styles.titulo}><Text style={styles.textocon}>Contacto</Text></View>
      <View style={styles.listado}>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id}
          initialNumToRender={100}
          renderItem={({ item }) => (
            <ListItem data={item} linkeo={() => navegar(item.link)} />
          )}
        />
      </View>
      <View style={styles.linea}></View>
      <View style={styles.titulo}><Text style={styles.textocon}>Ayuda</Text></View>
      <ListItem
        data={{
          title: "Canal de YouTube",
          logo: yt,
        }}
        linkeo={() =>
          navegar("https://www.youtube.com/channel/UCPG5tI4805MPm6jshejr5vA")
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1e8ee",
  },
linea:{
    height: 1, 
    backgroundColor: '#2980B9',
    marginVertical: 25
},
  listado: {
  },
  titulo:{
    marginVertical: 15,
    marginLeft: 23
  },
  textocon:{
    backgroundColor: '#e1e8ee',
    fontSize: 15,
    textAlign: 'center',
    textTransform: "uppercase",
    fontWeight: "bold",
    color: '#002742',
  }
});
