import { StyleSheet, View,ScrollView } from 'react-native';
import { useState } from 'react';
import { Text,Icon,Button,Input   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
import Dialog from './Dialog'
moment.locale('tr');
const requiredField = 'Bu alanın doldurulması zorunludur.';
const  Tab3 = (props) => {
  const { state, dispatch } = useStoreContext();
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);
  const [maskLoading, setMaskLoading] = useState(false);

  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);

  const [formSupport, setFormSupport] = useState({
    aciklama:"",
    iletisim:"",
    fiyat:0
  })
  const [formSupportError, setFormSupportError] = useState({
    aciklama:false,
    iletisim:false
  })
 
  
  const back = () => { 
    props.setTab(1);
  }
  
  const supportTask = () => { 

    const tempError = {

      aciklama:formSupport.aciklama.length == 0,
      iletisim:formSupport.iletisim.length == 0,

    }

    setFormSupport({...formSupportError, ...tempError});
    if( Object.keys(tempError).some(key => tempError[key] ) ) return;

    setMaskLoading(true);

    axios.post( Settings.baseUrl + '/servisIstegiTalebi/'+selectedTask.is_emri_id,formSupport,{ headers: { 'authorization': state.userToken } }) .then( (response) =>  {
      if(response.data?.status == 1){
        setDialogText("Servis talebi iletildi!");
        setDialogShow(true);
        back();
      }
      if(response.data?.message){
        setDialogText(response.data.message);
        setDialogShow(true);
      }
    })
    .catch( (error) => {
      setDialogText("Birşeyler ters gitti!");
      console.log(error);
    }).finally(()=> {setMaskLoading(false);} )
  }
  const formSupportChange = (_name,_value) => { 
    
    const tempError = {...formSupportError}
    tempError[_name] = _value.length == 0;
    setFormSupportError(tempError);
    setFormSupport({...formSupport,[_name]:_value});

  }


  return (
    <View style={styles.full}>
      <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
        <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
      </View>

      {
         selectedTask != null && <View style={{ flex: 1, flexDirection: 'column'}}>
            <View style={{ flex: 1}}>
              <View style={styles.container}>
                <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                  <Text h5 >Teknik Servis Desteği</Text>
                  <Icon  type='font-awesome' style={{marginRight:10,marginBottom:2}} name='truck'  color='#183153' />  
                </View>
                <View style={styles.divider} ></View>
              </View>
              <ScrollView>
                <View style={{margin:20}}>
                <Input onChangeText={(e)=> formSupportChange  ("aciklama",e)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Açıklama' errorMessage={formSupportError.aciklama && requiredField} />
                <Input keyboardType="numeric" onChangeText={(e)=> formSupportChange  ("iletisim",e)} leftIcon={{ type: 'font-awesome', name: 'phone' }} placeholder='İletişim Bilgisi' errorMessage={formSupportError.iletisim && requiredField} />
                <Input keyboardType="numeric" onChangeText={(e)=> formSupportChange  ("fiyat",e)} leftIcon={{ type: 'font-awesome', name: 'money' }} placeholder='Fiyat' errorMessage={formSupportError.fiyat && requiredField} />
                </View>
              </ScrollView>
            </View>
            <View style={{height:100, margin:20}}>
              <Button
                title="Servis Talebini Gönder"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={supportTask}
              />
              <View style={styles.backButton} >
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {props.setTab(2)}} />
              </View>
                

            </View>
         
          
        </View>
      }

      
      <Dialog dialogShow={dialogShow} dialogText={dialogText} setDialogShow={ setDialogShow }/>
    </View>
  );
}

const styles = StyleSheet.create({
  mask:{
    width:'100%',
    height:'100%',
    position:"absolute",
    zIndex:2,
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
    borderRadius: 20,
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

export default Tab3;