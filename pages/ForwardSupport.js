import { StyleSheet, View,ScrollView } from 'react-native';
import { useState } from 'react';
import { Text,Icon,Button,Input   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
const initialForm = {
  aciklama:"",
  iletisim:"",
  firmaAdi:"",
  fiyat:0
}
const  ForwardSupport = (props) => {
  const { state, dispatch } = useStoreContext();
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);
  const [maskLoading, setMaskLoading] = useState(false);
  const [formSupport, setFormSupport] = useState([{...initialForm}])
 
 
  
  const back = () => { 
    props.setTab('taskList');
  }
  const addSupport = () => {
    setFormSupport([...formSupport,{...initialForm}])
  }
  const deleteSupport = (_index) => {
    const tempData=[...formSupport]
    tempData.splice(_index,1)
    setFormSupport(tempData);
  }
  const supportTask = () => { 


    setMaskLoading(true);

    axios.post( Settings.baseUrl + '/servisIstegiTalebi/'+selectedTask.is_emri_id,formSupport,{ headers: { 'authorization': state.userToken } }) .then( (response) =>  {
      if(response.data?.status == 1){
        props.dialog.setDialogText("Harcama Talebi iletildi!");
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
      console.log(error);
    }).finally(()=> {setMaskLoading(false);} )
  }
  const formSupportChange = (_name,_value,_index) => { 
    const tempData=[...formSupport]
    tempData[_index]={...tempData[_index],[_name]:_value}
    setFormSupport(tempData);

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
                  <Text h5 >Harcama İzni</Text>
                  <Icon  type='font-awesome' style={{marginRight:10,marginBottom:2}} name='truck'  color='#183153' />  
                  {/* <Icon  type='font-awesome' style={{marginLeft:10}} name='plus'  color='green' onPress={addSupport}/>   */}
                </View>
                <View style={styles.divider} ></View>
              </View>
              <ScrollView>
                <View style={{margin:20}}>
                  <View style={{borderRadius: 20,width:'100%',display:'flex',justifyContent:'flex-end'}} >
                      <Button buttonStyle={{ width:100,padding:2,backgroundColor:'green',borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  
                      icon={<Icon  type='font-awesome'  name='plus'  color='white' iconStyle={{ marginRight: 10 }} />} 
                      title="Ekle"
                      onPress={addSupport}/>
                    </View>
                  {formSupport.map((item,index)=> <View key={index}  style={{...styles.listItemDivider}}>
                    
                    <Input onChangeText={(e)=> formSupportChange  ("firmaAdi",e,index)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Firma Adı'  />
                    <Input onChangeText={(e)=> formSupportChange  ("aciklama",e,index)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Açıklama'  />
                    <Input keyboardType="numeric" onChangeText={(e)=> formSupportChange  ("iletisim",e,index)} leftIcon={{ type: 'font-awesome', name: 'phone' }} placeholder='İletişim Bilgisi'  />
                    <Input keyboardType="numeric" onChangeText={(e)=> formSupportChange  ("fiyat",e,index)} leftIcon={{ type: 'font-awesome', name: 'money' }} placeholder='Fiyat'  />
                    <View style={{width:100,borderRadius: 20}} >
                      <Button buttonStyle={{ padding:2,backgroundColor:'red',borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  
                      icon={<Icon  type='font-awesome'  name='trash'  color='white' iconStyle={{ marginRight: 10 }} />} 
                      title="Sil"
                      onPress={()=> deleteSupport(index)}/>
                    </View>
                  
                  </View>) }
                </View>
                 
                
              </ScrollView>
            </View>
            <View style={{height:100, margin:20}}>
              <Button
                title="Harcama Talebini Gönder"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={supportTask}
              />
              <View style={styles.backButton} >
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {props.setTab('selectedTask')}} />
              </View>
                

            </View>
         
          
        </View>
      }

      
    </View>
  );
}

const styles = StyleSheet.create({
  listItemDivider:{
    width:'100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 10,  
  },
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

export default ForwardSupport;