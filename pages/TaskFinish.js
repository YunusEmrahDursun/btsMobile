import { StyleSheet, View,ScrollView } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button,Input ,ListItem  } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
import Picture from './Picture';
import Video from './Video';
moment.locale('tr');
const requiredField = 'Bu alanın doldurulması zorunludur.';
const  TaskFinish = (props) => {
  const { state, dispatch } = useStoreContext();
  const [maskLoading, setMaskLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);
  const [tab, setTab] = useState(1);
  const [form, setForm] = useState({
    aciklama:"",
    files:[]
  })
  const [formCompleteError, setFormCompleteError] = useState({
    aciklama:false,
    
  })

  // useEffect(() => {
  //   formCompleteChange("files",props.selectedTask.files || [])
  // }, [props.selectedTask])
  
  const back = () => { 
    props.setTab('taskList');
  }
  
  const compeleteTask = () => { 
    const tempError = {

      aciklama:form.aciklama.length == 0,

    }

    setFormCompleteError({...formCompleteError, ...tempError});
    if( Object.keys(tempError).some(key => tempError[key] ) ) return;

    setMaskLoading(true);
  
    axios.post( Settings.baseUrl + '/isEmiriTamamla/'+selectedTask.is_emri_id,form,{ headers: { 'authorization': state.userToken,location:state.location } }) .then( (response) =>  {
      if(response.data?.status == 1){
        props.dialog.setDialogText("İşlem Tamamlandı!");
        props.dialog.setDialogShow(true);
        back();
      }
      if(response.data?.message){
        props.dialog.setDialogText(response.data.message);
        props.dialog.setDialogShow(true);
      }
    })
    .catch( (error) => {
      props.dialog.setDialogText("Birşeyler ters gitti!");
      props.dialog.setDialogShow(true);
      console.log(error);
    }).finally(()=> {setMaskLoading(false);} )
  }
 
  const formCompleteChange = (_name,_value) => { 
    
    const tempError = {...formCompleteError}
    tempError[_name] = _value.length == 0;
    setFormCompleteError(tempError);
    setForm({...form,[_name]:_value});

  }

  const removeFile = (item) => { 

    setForm({...form,files:form.files.filter(i=> i != item)});

  }
 
  
  return (
    <>
    { tab == 1 && <View style={styles.full}>
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
                    <Input value={form.aciklama} onChangeText={(e)=> formCompleteChange  ("aciklama",e)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Açıklama' errorMessage={formCompleteError.aciklama && requiredField} />

                    {
                      form.files && form.files.map((item, i) => (
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
              <View style={{height:100, margin:20, display:'flex'}}>
                <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                  <Button disabled={form.files.length >= 3}  onPress={()=>{setTab(2)}} buttonStyle={styles.button}
                    icon={<Icon name="camera" color="white"  />}
                    containerStyle={styles.buttonContainer}/>
                  <Button disabled={form.files.length >= 3}  onPress={()=>{setTab(3)}} buttonStyle={styles.button}
                    icon={<Icon type='font-awesome'  name="video-camera" color="white"  />}
                    containerStyle={styles.buttonContainer}/> 
                  <Button
                    icon={<Icon name="check" color="white"  />}
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                    title=" Tamamla"
                    titleStyle={{fontSize:12}}
                    onPress={compeleteTask}
                  />
                </View>
                
                <View style={styles.backButton} >
                  <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {props.setTab('selectedTask')}} />
                </View>

              </View>
          
            
          </View>
        }

      
      </View>}
      {
        tab == 2 && <Picture selectedTask={form} setSelectedTask={setForm} setTab={setTab} dialog={props.dialog}/> 
      }
      {
        tab == 3 && <Video selectedTask={form} setSelectedTask={setForm} setTab={setTab} dialog={props.dialog}/>
      }
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
    maxWidth:'33%',
    flex:1,
    marginLeft:5,
    marginRight:5
  },
  
});

export default TaskFinish;