import { StyleSheet, View,ScrollView,Text as Text2 } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import 'moment/locale/tr';
const requiredField = 'Bu alanın doldurulması zorunludur.';
moment.locale('tr');

const  FowardTaskRequest = (props) => {
  const { state, dispatch } = useStoreContext();
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);
  const [maskLoading, setMaskLoading] = useState(false);
  const [yonlendirilen, setYonlendirilen] = useState(null);
  const [userList, setUserList] = useState([])
 

  const back = () => { 
    props.setTab('selectedTask');
  }
  
  const getColor = (status) => { 

    if( status == "open"){
      return 'red';
    }else if( status == "success" ){
      return 'green';
    }else if( status == "transfer" ){
      return 'orange';
    }else if( status == "support" ){
      return 'blue';
    }else{
      return 'gray';
    }
    
  }
 
  const transferTask = () => { 
    if(!yonlendirilen){
      props.dialog.setDialogText("Lütfen bir kullanıcı seçiniz");
      props.dialog.setDialogShow(true);
      return;
    }
    setMaskLoading(true);
  
    axios.post( Settings.baseUrl + '/isEmiriYonlendir/'+selectedTask.is_emri_id,{yonlendirilen_kullanici_id:yonlendirilen},{ headers: { 'authorization': state.userToken } }) .then( (response) =>  {
      if(response.data?.status == 1){
        props.dialog.setDialogText("Kullanıcıya transfer isteği gönderildi!");
        props.dialog.setDialogShow(true);
        back();
      }
      if(response.data?.message){
        props.dialog.setDialogText(response.data.message);
        props.dialog.setDialogShow(true);
      }
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> {setMaskLoading(false);} )
  }

  useEffect(() => {
    axios.get( Settings.baseUrl + '/subeTeknikPersonelleri/' ,{ headers: { 'authorization': state.userToken } }
    ).then( (response) =>  {
      const temp=response.data.map(i=> { return { value:i.kullanici_id,label: i.kullanici_isim + ' ' + i.kullanici_soyisim }})

      setUserList(temp)
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> {} )

  }, [])
  
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
                  <Text h5 >İş Emri Detayları</Text>
                    <View    style={{maxWidth:150,backgroundColor:getColor(selectedTask.is_emri_durum_key),borderRadius:20,paddingLeft:10,paddingRight:10,paddingBottom:5,paddingTop:5}}>
                    <Text2 ellipsizeMode='tail'  numberOfLines={1} style={{color:'#fff'}}>
                      {selectedTask.is_emri_durum_adi}
                    </Text2>
                  </View>
                </View>
                <View style={styles.divider} ></View>
              </View>
              <ScrollView>
                <View style={{margin:20}}>
                  <Text style={styles.detailText}>{`Yönlendirilecek kullanıcıyı seçiniz:`}</Text>
                  <Picker
                      selectedValue={yonlendirilen}
                      onValueChange={(itemValue, itemIndex) =>
                        setYonlendirilen(itemValue)
                      }>
                          <Picker.Item key={0} label={"Seçiniz"} value={null} />
                      {
                        userList.map(user=> <Picker.Item key={user.value} label={user.label} value={user.value} />)
                      }  
                      
                    </Picker>
                  
                </View>
              </ScrollView>
            </View>
            <View style={{height:220, margin:20}}>
              <Button
                disabled={selectedTask.is_emri_durum_key != "open"}
                title="Yönlendir"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={transferTask}
              />
             
              <View style={styles.backButton} >
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={back} />
              </View>

            </View>
         
          
        </View>
      }

      
      
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

export default FowardTaskRequest;