import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect,useRef } from 'react';
import { useStoreContext } from './Store';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Temizlik from './pages/Temizlik';
import Settings from './Settings';
import axios, * as others from 'axios';
import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';
import * as Device from "expo-device";
import * as Location from 'expo-location';
import { Text } from '@rneui/themed';
import Constants from 'expo-constants';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }),
});

const  Workspace = () => {
  const { state, dispatch } = useStoreContext();
  
  const notificationListener = useRef();
  const responseListener = useRef();
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
  
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log("existingStatus", existingStatus);
        }
  
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            console.log("finalStatus", finalStatus);
            return;
        }
  
        token = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId
        })).data;
    } else {
        alert("Must use physical device for Push Notifications");
    }
  
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            showBadge: true,
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FE9018",
        });
    }
    dispatch({ type: 'setPushToken', payload: token });
    return token;
  }
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {});

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      dispatch({ type: 'refresh' });
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        const {
            notification: {
                request: {
                    content: {
                        data: { screen },
                    },
                },
            },
        } = response;


        if (screen) {
            props.navigation.navigate(screen);
        }
    });

    
}, []);

  const getLocation = () => { 
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status == 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        dispatch({ type: 'changeLocation', payload: location });
      }
      
    })();
  }
  useEffect(() => {
    getLocation();

    const intervalId = setInterval(() => {
      getLocation();
    }, 5 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {

    if(state.userToken && state.pushToken){
      axios.post( Settings.baseUrl + '/setPushToken' ,{ pushToken:state.pushToken },{ headers: { 'authorization': state.userToken } })
      .then( (response) =>  { 
       })
      .catch( (error) => {
        console.log(error);
      })
    }
      
  }, [state.userToken,state.pushToken])
  

 
  const checkTokenRequest = () => {
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
  }

  useEffect( () => {
    AsyncStorage.getItem('type').then(value => {
      if (value !== null) {
        dispatch({ type: 'changeType', payload: value });
        checkTokenRequest()
      }else{
        dispatch({ type: 'removeToken' });
      }
    });
   
  
  }, [])
  


  return (
    <>
      { state.tab == 'login' && <Login/>}
      { state.tab == 'register' && <Register/>}
      { state.tab == 'home' && state.type == 'teknik' && <Home/>}
      { state.tab == 'home' && state.type == 'temizlik' && <Temizlik/>}

    </>
  );
}


export default Workspace;