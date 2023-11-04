import { StyleSheet, View,ScrollView } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button,Input ,ListItem  } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import Dialog from './Dialog'
const requiredField = 'Bu alanın doldurulması zorunludur.';
const  Task4 = (props) => {
  const { state, dispatch } = useStoreContext();
  const [maskLoading, setMaskLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);
  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);

  const [formComplete, setFormComplete] = useState({
    aciklama:"",
    files:[]
  })
  const [formCompleteError, setFormCompleteError] = useState({
    aciklama:false,
    
  })

  useEffect(() => {
    formCompleteChange("files",props.selectedTask.files || [])
  }, [props.selectedTask])
  
  const back = () => { 
    props.setTab(1);
  }
  
  const compeleteTask = () => { 
    const tempError = {

      aciklama:formComplete.aciklama.length == 0,

    }

    setFormCompleteError({...formCompleteError, ...tempError});
    if( Object.keys(tempError).some(key => tempError[key] ) ) return;

    setMaskLoading(true);
  
    axios.post( Settings.baseUrl + '/isEmiriTamamla/'+selectedTask.is_emri_id,formComplete,{ headers: { 'authorization': state.userToken } }) .then( (response) =>  {
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
 
  const formCompleteChange = (_name,_value) => { 
    
    const tempError = {...formCompleteError}
    tempError[_name] = _value.length == 0;
    setFormCompleteError(tempError);
    setFormComplete({...formComplete,[_name]:_value});

  }

  const removeFile = (item) => { 
    props.setSelectedTask({...selectedTask,files:selectedTask.files.filter(i=> i != item)})
    setSelectedTask({...selectedTask,files:selectedTask.files.filter(i=> i != item)})
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
                  <Text h5 >İş Emrini Tamamla</Text>
                  <Icon  type='font-awesome' style={{marginRight:10,marginBottom:2}} name='check'  color='#183153' />  
                </View>
                <View style={styles.divider} ></View>
              </View>
              <ScrollView>
                <View style={{margin:20}}>
                  <Input onChangeText={(e)=> formCompleteChange  ("aciklama",e)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Açıklama' errorMessage={formCompleteError.aciklama && requiredField} />

                  {
                    selectedTask.files && selectedTask.files.map((item, i) => (
                      <ListItem key={i} style={{marginLeft:10}}>
                        <ListItem.Content >
                          <ListItem.Title>
                            <View style={{display:'flex',alignItems:'center',flexDirection:'row'}}>
                                <ListItem.Chevron style={{marginRight:10}}/>
                                <Text h4>{"Dosya "+(i+1)}  </Text>
                                <Button
                                  style={{marginLeft:20}}
                                  icon={<Icon name="trash" type="font-awesome" color="white"  />}
                                  buttonStyle={{backgroundColor:'red',borderRadius:20}}
                                  onPress={()=>{removeFile(item)}}
                                />
                              </View>
                              
                          </ListItem.Title>
                        </ListItem.Content>
                      </ListItem>
                    ))
                  }
                </View>
              </ScrollView>
            </View>
            <View style={{height:250, margin:20}}>
              <Button title="Fotoğraf Çek" onPress={()=>{props.setTab(5)}} buttonStyle={styles.button}
                icon={<Icon name="camera" color="white" iconStyle={{ marginRight: 10 }} />}
                containerStyle={styles.buttonContainer}/>
               <Button title="Video Çek" onPress={()=>{props.setTab(6)}} buttonStyle={styles.button}
                icon={<Icon type='font-awesome'  name="video-camera" color="white" iconStyle={{ marginRight: 10 }} />}
                containerStyle={styles.buttonContainer}/> 
              <Button
                title="İş Emrini Tamamla"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={compeleteTask}
              />
              
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}} style={styles.backButton} icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {props.setTab(2)}} />

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

export default Task4;