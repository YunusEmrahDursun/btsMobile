import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState,useEffect } from 'react';
import { Text } from '@rneui/themed';
import { Input,Button } from '@rneui/themed';
import { useStoreContext } from './Store';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const  Workspace = () => {
  const { state, dispatch } = useStoreContext();
  
  return (
    <>
      { state.tab == 'login' && <Login/>}
      { state.tab == 'register' && <Register/>}
      { state.tab == 'home' && <Home/>}

    </>
  );
}


export default Workspace;