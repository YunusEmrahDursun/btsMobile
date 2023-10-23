import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect } from 'react';
import { useStoreContext } from './Store';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Settings from './Settings';
import axios, * as others from 'axios';

const  Workspace = () => {
  const { state, dispatch } = useStoreContext();
  
  useEffect( () => {
    AsyncStorage.getItem('token').then(value => {
      if (value !== null) {
        axios.post( Settings.baseUrl + '/checkToken' ,{ token:value })
        .then( (response) =>  {
          if(response.data.status = 1){
            dispatch({ type: 'changeToken', payload: value });
          }
        })
        .catch( (error) => {
          console.log(error);
        })
      }
    });
    
  }, [])
  
  return (
    <>
      { state.tab == 'login' && <Login/>}
      { state.tab == 'register' && <Register/>}
      { state.tab == 'home' && <Home/>}

    </>
  );
}


export default Workspace;