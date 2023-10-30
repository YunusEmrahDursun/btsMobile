import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect,useRef } from 'react';
import { useStoreContext } from './Store';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Settings from './Settings';
import axios, * as others from 'axios';
import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';
import * as Device from "expo-device";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }),
});

const  Workspace = () => {
  const { state, dispatch } = useStoreContext();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  
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
  
        token = (await Notifications.getExpoPushTokenAsync()).data;
  
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
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log(notification)
        setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response)
        const {
            notification: {
                request: {
                    content: {
                        data: { screen },
                    },
                },
            },
        } = response;

        // When the user taps on the notification, this line checks if they //are suppose to be taken to a particular screen
        if (screen) {
            props.navigation.navigate(screen);
        }
    });

    
}, []);
  

  useEffect(() => {

    if(state.userToken && state.pushToken){
      axios.post( Settings.baseUrl + '/setPushToken' ,{ pushToken:state.pushToken },{ headers: { 'authorization': state.userToken } })
      .then( (response) =>  {  })
      .catch( (error) => {
        console.log(error);
      })
    }
      
  }, [state.userToken,state.pushToken])
  

 

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