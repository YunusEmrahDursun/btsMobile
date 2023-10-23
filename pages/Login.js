import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState,useEffect } from 'react';
import { Text } from '@rneui/themed';
import { Input,Button } from '@rneui/themed';
import { useStoreContext } from '../Store';

const  Login = () => {
    
  const { state, dispatch } = useStoreContext();

  const loginClick = () => { 
    dispatch({ type: 'changeTab', payload: "home" });
  }
  const registerClick = () => { 
    dispatch({ type: 'changeTab', payload: "register" });
  }
  return (
    <View style={styles.container}>
        <Text h3 style={styles.title}>BTS</Text>
        <Input leftIcon={{ type: 'font-awesome', name: 'user' }} placeholder='Kullanıcı Adı' />
        <Input leftIcon={{ type: 'font-awesome', name: 'key' }} placeholder='Şifre' />
        <Button style={styles.button} title="Giriş" onPress={loginClick} />
        <Button style={styles.button} title="Kayıt Ol" onPress={registerClick} />
    </View>
  );
}

const styles = StyleSheet.create({
  full:{
    width:'100%',
    height:'100%'
  },
  bottom:{
    position:'absolute',
    bottom:0,
  },
  container: {
    marginLeft:20,
    marginRight:20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    width:200,
    marginBottom:20
  },
  title:{
    marginBottom:20
  },

});

export default Login;