import { StyleSheet, View,ScrollView,Text as Text2 } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button,Input ,ListItem   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
import Picture from './Picture';
import Video from './Video';
import CreateBina from './CreateBina';
import {Picker} from '@react-native-picker/picker';
moment.locale('tr');
const  CreateTask = (props) => {
  const { state, dispatch } = useStoreContext();
  const [maskLoading, setMaskLoading] = useState(false);
  const [binaList, setBinaList] = useState([])
  const [bina, setBina] = useState(null);
  const [tab, setTab] = useState(1)  
  const [search, setSearch] = useState("");
  const [showBinaList, setShowBinaList] = useState([])

  const [form, setForm] = useState({
    aciklama:"",
    files:[]
  })
  const back = () => { 
    props.setTab('taskList');
  }
  
  useEffect(() => {
    try {
      if(search != ""){
        setShowBinaList(binaList.filter(i=> i.label.includes(search)))
      }else{
        setShowBinaList(binaList)
      }
    } catch (error) {
      
    }
   
  }, [binaList,search])
  

  useEffect(() => {
    try {
      if(tab == 1){
        axios.get( Settings.baseUrl + '/subeBinalari/' ,{ headers: { 'authorization': state.userToken } }
        ).then( (response) =>  {
          const temp=response.data.map(i=> { return { value:i.bina_id,label: i.bina_adi }})
    
          setBinaList(temp)
        })
        .catch( (error) => {
          console.log(error);
        }).finally(()=> {} )
      }
    } catch (error) {
      
    }
   
  

  }, [tab])
 
  const createTask = () => { 
    try {
      if(!bina){
        props.dialog.setDialogText("Lütfen bir bina seçiniz");
        props.dialog.setDialogShow(true);
        return;
      }
      setMaskLoading(true);
  
      axios.post( Settings.baseUrl + '/taskOlustur/',{bina_id:bina,is_emri_aciklama:form.aciklama,files:form.files},{ headers: { 'authorization': state.userToken,location:state.location } }) .then( (response) =>  {
        if(response.data?.status == 1){
          props.dialog.setDialogText("İş Oluşturuldu");
          props.dialog.setDialogShow(true);
          props.setTab('taskList');
         
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
  const removeFile = (item) => { 

    setForm({...form,files:form.files.filter(i=> i != item)});

  }

  
  return (
    <>
      {  tab == 1 &&  <View style={styles.full}>
        <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
          <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
        </View>
        {
          <View style={{ flex: 1, flexDirection: 'column'}}>
              <View style={{ flex: 1}}>
                <View style={styles.container}>
                  <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                    <Text h5 >İş Oluştur</Text>
                  </View>
                  <View style={styles.divider} ></View>
                </View>
                <ScrollView>
                  <View style={{margin:20}}>
                    <Input value={form.aciklama} onChangeText={(e)=> formChange  ("aciklama",e)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Açıklama'  />
                    <Text style={styles.detailText}>{`Bina seçiniz:`}</Text>
                    <Input value={search} onChangeText={setSearch} leftIcon={{ type: 'font-awesome', name: 'search' }} placeholder='Bina Filtrele'  />
                    <Picker
                        selectedValue={bina}
                        onValueChange={(itemValue, itemIndex) =>
                          setBina(itemValue)
                        }>
                            <Picker.Item key={0} label={"Seçiniz"} value={null} />
                        {
                          showBinaList.map(item=> <Picker.Item key={item.value} label={item.label} value={item.value} />)
                        }  
                        
                      </Picker>
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
                  <Button
                      icon={<Icon type='font-awesome' name="building" color="white"  />}
                      buttonStyle={styles.button}
                      containerStyle={styles.buttonContainer}
                      title=" Bina Ekle"
                      titleStyle={{fontSize:12}}
                      onPress={()=>{setTab(4)}}
                    />
                  <Button disabled={form.files.length >= 3}  onPress={()=>{setTab(2)}} buttonStyle={styles.button}
                    icon={<Icon name="camera" color="white"  />}
                    containerStyle={styles.buttonContainer}/>
                  <Button disabled={form.files.length >= 3}  onPress={()=>{setTab(3)}} buttonStyle={styles.button}
                    icon={<Icon type='font-awesome'  name="video-camera" color="white"  />}
                    containerStyle={styles.buttonContainer}/> 
                  <Button
                    icon={<Icon name="check" color="white" />}
                    buttonStyle={styles.button}
                    containerStyle={styles.buttonContainer}
                    title=" Oluştur"
                    titleStyle={{fontSize:12}}
                    onPress={createTask}
                  />
                  </View>

                  <View style={styles.backButton} >
                    <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> { back()}} />
                  </View>
                </View>
          
            
          </View>
        }
      </View>
      }
      
      {
        tab == 2 && <Picture selectedTask={form} setSelectedTask={setForm} setTab={setTab} dialog={props.dialog}/> 
      }
      {
        tab == 3 && <Video selectedTask={form} setSelectedTask={setForm} setTab={setTab} dialog={props.dialog}/>
      }
      {
        tab == 4 && <CreateBina  setTab={setTab} dialog={props.dialog}/> 
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
    maxWidth:'25%',
    flex:1,
    marginLeft:5,
    marginRight:5
  },
  
});

export default CreateTask;