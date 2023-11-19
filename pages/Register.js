import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View,ScrollView } from 'react-native';
import { useState,useEffect } from 'react';
import { Input,Button,Divider,Text,Dialog,Icon  } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import { Camera } from 'expo-camera';
const requiredField = 'Bu alanın doldurulması zorunludur.';
const passNoMatch = 'Girilen şifreler eşleşmeli.';
const  Register = () => {
  const { state, dispatch } = useStoreContext();
  const [tab, setTab] = useState(1);

  const [form, setForm] = useState({
    kullanici_isim:"",
    kullanici_soyisim:"",
    kullanici_telefon:"",
    kullanici_adi:"",
    kullanici_parola:"",
    kullanici_parola_tekrar:"",
    link:""
  })
  const [formError, setFormError] = useState({
    kullanici_isim:false,
    kullanici_soyisim:false,
    kullanici_telefon:false,
    kullanici_adi:false,
    kullanici_parola:false,
    kullanici_parola_tekrar:false,
    kullanici_parola_tekrar_match:false,
    link:false
  })

  const [registerLoading, setRegisterLoading] = useState(false);

  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);

  const registerLinkClick = () => { 
    if(form.link.length == 0 ) {
       setFormError({...formError, link: true}) 
      return;
    }
    setRegisterLoading(true);
    axios.get( Settings.baseUrl + '/checkJoinLink/' + form.link) .then( (response) =>  {
      if(response.data?.status == 1){
        setTab(2);
      }
      if(response.data?.message){
        setDialogText(response.data.message);
        setDialogShow(true);
      }
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> setRegisterLoading(false) )
  
  }

  const registerUserClick = () => { 
    
    const tempError = {

      kullanici_isim: form.kullanici_isim.length == 0,
      kullanici_soyisim:form.kullanici_soyisim.length == 0,
      kullanici_telefon:form.kullanici_telefon.length == 0,
      kullanici_adi:form.kullanici_adi.length == 0,
      kullanici_parola:form.kullanici_parola.length == 0,
      kullanici_parola_tekrar:form.kullanici_parola_tekrar.length == 0,
      kullanici_parola_tekrar_match: form.kullanici_parola != form.kullanici_parola_tekrar

    }
    setFormError({...formError, ...tempError});
    if( Object.keys(tempError).some(key => tempError[key] ) ) return;
    
    
    setRegisterLoading(true);
    axios.post( Settings.baseUrl + '/register',form) .then( (response) =>  {
      if(response.data?.status == 1 && response.data?.token){
        dispatch({ type: 'changeToken', payload: response.data.token });
      }
      if(response.data?.message){
        setDialogText(response.data.message);
        setDialogShow(true);
      }
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> setRegisterLoading(false) )
  
  }

  const formChange = (_name,_value) => { 
    
    const tempError = {...formError}
    if(_name == "kullanici_parola_tekrar" ){
      tempError.kullanici_parola_tekrar_match = form.kullanici_parola != _value;

    }
    if(_name == "kullanici_parola" && form.kullanici_parola_tekrar.length != 0){
      tempError.kullanici_parola_tekrar_match =  _value != form.kullanici_parola_tekrar;
    }
    tempError[_name] = _value.length == 0;
    setFormError(tempError);
    setForm({...form,[_name]:_value});
  }
 
  const back = () => { 
    dispatch({ type: 'changeTab', payload: "login" });
  }
  return (
    <View style={styles.full}> 

      { tab == 1 && <>

        <View style={styles.container}>

          <Text h3 style={styles.title}> <Icon type='font-awesome' style={{marginRight:10,marginBottom:2}} name='building'  color='#183153'/>BTS</Text>
          <Input style={styles.link}  placeholder='Katılım Kodu' onChangeText={(e)=> formChange("link",e)} leftIcon={{ type: 'font-awesome', name: 'link' }} errorStyle={{ color: 'red' }} errorMessage={formError.link && requiredField}  />
          <View style={styles.button} >
            <Button  loading={registerLoading} title="Katıl" onPress={registerLinkClick} />
          </View>
          
        
        </View>

      </>}
      { tab == 2 &&  <>
          <View style={styles.containerRegister}>

              <Text h5 style={{textAlign:'left',width:'100%'}}>Kullanıcı Bilgileri</Text>

              <View style={styles.divider} />
              <ScrollView>
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1
                }}>
                  <Input placeholder='İsim' onChangeText={(e)=> formChange("kullanici_isim",e)} errorStyle={{ color: 'red' }} errorMessage={formError.kullanici_isim && requiredField}/>
                  <Input placeholder='Soy İsim' onChangeText={(e)=> formChange("kullanici_soyisim",e)} errorStyle={{ color: 'red' }} errorMessage={formError.kullanici_soyisim && requiredField}/>
                  <Input keyboardType="numeric" placeholder='Telefon' onChangeText={(e)=> formChange("kullanici_telefon",e)} leftIcon={{ type: 'font-awesome', name: 'phone' }} errorMessage={formError.kullanici_telefon && requiredField}/>
                  <Input placeholder='Kullanıcı Adı' onChangeText={(e)=> formChange("kullanici_adi",e)} leftIcon={{ type: 'font-awesome', name: 'user' }} errorMessage={formError.kullanici_adi && requiredField}/>
                  <Input placeholder='Şifre' onChangeText={(e)=> formChange("kullanici_parola",e)} leftIcon={{ type: 'font-awesome', name: 'key' }}  errorMessage={formError.kullanici_parola && requiredField} secureTextEntry={true} />
                  <Input placeholder='Şifre Tekrarı' onChangeText={(e)=> formChange("kullanici_parola_tekrar",e)}  leftIcon={{ type: 'font-awesome', name: 'key' }}  secureTextEntry={true}
                    errorMessage={
                      (formError.kullanici_parola_tekrar && requiredField) || (formError.kullanici_parola_tekrar_match && passNoMatch)
                    } 
                  />
                  <View style={styles.button} >
                    <Button  loading={registerLoading} title="Kayıt Ol" onPress={registerUserClick} />
                  </View>
                </View>
                
              </ScrollView>
          </View>
          
       
      </> }
    

      <Dialog
        isVisible={dialogShow}
        onBackdropPress={() => { setDialogShow(false); }}
      >
        <Dialog.Title style={{alignItems: 'center'}} title='Uyarı!'/>
        <View style={styles.divider} ></View>
        <Text style={{textAlign: 'center',marginTop:5}}>{dialogText}</Text>
        <Button color="secondary" style={{  marginTop:20,  alignItems: 'center' }}  type="outline"  title="Kapat" onPress={() => { setDialogShow(false); }} />
      </Dialog>
      <View style={styles.backButton} >
        <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 }}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={back} />
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  full:{
    width:'100%',
    height:'100%',
    position:'relative'
  },
  button:{
    marginTop:10,
    width:200
  },
  backButton:{
    marginBottom:50,
    width:70,
    borderRadius: 20,
    marginLeft:10
  },
  container: {
    marginLeft:20,
    marginRight:20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerRegister: {
    marginTop:50,
    marginLeft:20,
    marginRight:20,
    backgroundColor: '#fff',
  },
  title:{
    marginBottom:20,
  },
  divider:{
    width:'100%',
    height:5,
    backgroundColor:'#90c4fa',
    borderRadius:30,
    marginBottom:5,
    marginTop:5,
    paddingLeft:10,
    paddingRight:10
  }

});

export default Register;