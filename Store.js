import React, { createContext, useContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Store = createContext();

const initialState = {
    tab : "login",
    userToken: "",
    pushToken:"",
    refreshData:true,
    type:"",
    location:{latitude:"",longitude:""}
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case 'refresh':
      return {
        ...state,
        refreshData: !state.refreshData,
      };
    case 'setPushToken':
      return {
        ...state,
        pushToken: action.payload,
      };
    case 'changeTab':
      return {
        ...state,
        tab: action.payload,
      };
    case 'changeLocation':
      let tempData={latitude:"",longitude:""};
      if(action.payload){
        tempData.latitude = action.payload.coords.latitude;
        tempData.longitude = action.payload.coords.longitude;
      }
      return {
        ...state,
        location: JSON.stringify(tempData),
      };
    case 'removeToken':
      try {
        AsyncStorage.removeItem('token');
      } catch (error) {
      }
      return {
        ...state,
        tab:"login",
        userToken: "",
      };  
    case 'changeToken':
      try {
        AsyncStorage.setItem( 'token', action.payload );
      } catch (error) {
      }
      return {
        ...state,
        tab:"home",
        userToken: action.payload,
      };
    case 'changeType':
      try {
        AsyncStorage.setItem( 'type', action.payload );
      } catch (error) {
      }
      return {
        ...state,
        type: action.payload,
      };
    case 'removeType':
      try {
        AsyncStorage.removeItem('type');
      } catch (error) {
      }
      return {
        ...state,
        type: ""
      };
    default:
      return state;
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>
      {children}
    </Store.Provider>
  );
};

export const useStoreContext = () => useContext(Store);