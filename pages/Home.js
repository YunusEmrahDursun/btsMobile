import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState,useEffect } from 'react';
import { Text } from '@rneui/themed';
import { useStoreContext } from '../Store';

const  Home = () => {
  const { state, dispatch } = useStoreContext();
  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>BTS {state.userToken}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft:20,
    marginRight:20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    marginBottom:20
  },

});

export default Home;