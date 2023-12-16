import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState,useEffect } from 'react';
import { Text } from '@rneui/themed';
import { Input,Button,Icon,Dialog } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';

const requiredField = 'Bu alanın doldurulması zorunludur.';
const  Login = () => {
    
  const { state, dispatch } = useStoreContext();
  const [loginLoading, setLoginLoading] = useState(false);

  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);

  const [form, setForm] = useState({
    kullanici_adi:"",
    kullanici_parola:"",
  })
  const [formError, setFormError] = useState({
    kullanici_adi:false,
    kullanici_parola:false,
  })

  const loginClick = () => { 

    const tempError = {

      kullanici_adi:form.kullanici_adi.length == 0,
      kullanici_parola:form.kullanici_parola.length == 0,

    }

    setFormError({...formError, ...tempError});
    if( Object.keys(tempError).some(key => tempError[key] ) ) return;

    setLoginLoading(true);
    axios.post( Settings.baseUrl + '/login',form) .then( (response) =>  {
      if(response.data?.status == 1 && response.data?.token){
        console.log(response.data)
        dispatch({ type: 'changeToken', payload: response.data.token });
        dispatch({ type: 'changeType', payload: response.data.auth });
      }
      if(response.data?.message){
        setDialogText(response.data.message);
        setDialogShow(true);
      }
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> setLoginLoading(false) )

  }
  const registerClick = () => { 
    dispatch({ type: 'changeTab', payload: "register" });
  }
  const formChange = (_name,_value) => { 
    
    const tempError = {...formError}
    tempError[_name] = _value.length == 0;
    setFormError(tempError);
    setForm({...form,[_name]:_value});
  }
  return (
    <View style={styles.container}>
       <Text h3 style={styles.title}> <Icon type='font-awesome' style={{marginRight:10,marginBottom:2}} name='building'  color='#183153'/>BTS</Text>
        <Input onChangeText={(e)=> formChange("kullanici_adi",e)} leftIcon={{ type: 'font-awesome', name: 'user' }} placeholder='Kullanıcı Adı' errorMessage={formError.kullanici_adi && requiredField} />
        <Input onChangeText={(e)=> formChange("kullanici_parola",e)} leftIcon={{ type: 'font-awesome', name: 'key' }} placeholder='Şifre' errorMessage={formError.kullanici_parola && requiredField} secureTextEntry={true}/>
        <View style={styles.button} >
          <Button  loading={loginLoading} title="Giriş" onPress={loginClick} />
        </View>
        <View style={styles.button} >
          <Button title="Kayıt Ol" onPress={registerClick} />
        </View>

        <Dialog
        isVisible={dialogShow}
        onBackdropPress={() => { setDialogShow(false); }}
      >
        <Dialog.Title style={{alignItems: 'center'}} title='Uyarı!'/>
        <View style={styles.divider} ></View>
        <Text style={{textAlign: 'center',marginTop:5}}>{dialogText}</Text>
        <Button color="secondary" style={{  marginTop:20,  alignItems: 'center' }}  type="outline"  title="Kapat" onPress={() => { setDialogShow(false); }} />
      </Dialog>
        
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