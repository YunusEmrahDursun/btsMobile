import { StyleSheet, View,ScrollView,Text as Text2 } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button,Input ,ListItem   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
const  CreateBina = (props) => {
  const { state, dispatch } = useStoreContext();
  const [maskLoading, setMaskLoading] = useState(false);

  const [form, setForm] = useState({
    binaAdi:"",
    adres:""
  })
  const back = () => { 
    props.setTab(1);
  }
  
 
  const createBina = () => { 
    try {
      setMaskLoading(true);

      axios.post( Settings.baseUrl + '/binaOlustur/',{bina_adi:form.binaAdi,adres:form.adres},{ headers: { 'authorization': state.userToken } }) .then( (response) =>  {
        if(response.data?.status == 1){
          props.dialog.setDialogText("Bina Oluşturuldu");
          props.dialog.setDialogShow(true);
          props.setTab(1);
        
        }
        if(response.data?.message){
          props.dialog.setDialogText(response.data.message);
          props.dialog.setDialogShow(true);
        }
      })
      .catch( (error) => {
        console.log(error);
      }).finally(()=> {setMaskLoading(false);} )
    } catch (error) {
      
    }
    
  }
  const formChange = (_name,_value) => { 
    
    setForm({...form,[_name]:_value});

  }

  
  return (
    <>
      <View style={styles.full}>
        <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
          <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
        </View>
        {
          <View style={{ flex: 1, flexDirection: 'column'}}>
              <View style={{ flex: 1}}>
                <View style={styles.container}>
                  <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                    <Text h5 >Bina Oluştur</Text>
                  </View>
                  <View style={styles.divider} ></View>
                </View>
                <ScrollView>
                  <View style={{margin:20}}>
                    <Input value={form.binaAdi} onChangeText={(e)=> formChange  ("binaAdi",e)} leftIcon={{ type: 'font-awesome', name: 'building' }} placeholder='Bina Adı'  />
                    <Input value={form.adres} onChangeText={(e)=> formChange  ("adres",e)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Adres'  />
                  </View>
                </ScrollView>
              </View>
              <View style={{height:150, margin:20}}>
                <Button
                  title="Bina Oluştur"
                  icon={<Icon type='font-awesome' name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={createBina}
                />
                <View style={styles.backButton} >
                  <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> { back()}} />
                </View>

              </View>
          
            
          </View>
        }
      </View>
      
      
    
    </>
  );
}

const styles = StyleSheet.create({
  mask:{
    width:'100%',
    height:'100%',
    position:"absolute",
    zIndex:99999,
    elevation:1,
    backgroundColor:'#000000aa',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noRecord:{
    backgroundColor:'#fff',
    height:200,
    margin:20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  full:{
    width:'100%',
    height:'100%',
    position:'relative'
  },
  container: {
    marginTop:50,
    marginLeft:20,
    marginRight:20,
    backgroundColor: '#fff',
   
  },
  title:{
    marginBottom:20
  },
  backButton:{
    width:70,
    borderRadius: 20
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
  },
  
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  
});

export default CreateBina;