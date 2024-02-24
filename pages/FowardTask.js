import { StyleSheet, View,ScrollView,Text as Text2 } from 'react-native';
import { useState } from 'react';
import { Text,Icon,Button   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';

moment.locale('tr');
const  FowardTask = (props) => {
  const { state, dispatch } = useStoreContext();
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);
  const [maskLoading, setMaskLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [tab, setTab] = useState(1);


  const convertDateFull = (_value) => {
    return moment(_value).format('Do MMMM YYYY, HH:mm');
  }
 
  const back = () => { 
    props.setTab('forwardList');
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
  const sendFowardTask = (status) => { 
    try {
      setMaskLoading(true);
  
      axios.post( Settings.baseUrl + '/yonlendirmeTalepCevap/'+selectedTask.is_emri_id,{status:status},{ headers: { 'authorization': state.userToken,location:state.location } }) .then( (response) =>  {
        if(response.data?.status == 1){
          props.dialog.setDialogText("Transfer isteği cevabı iletildi!");
          props.dialog.setDialogShow(true);
          props.setTab('forwardList');
        
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
  
  return (
    <View style={styles.full}>
      <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
        <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
      </View>
      
      {
         tab == 1 && selectedTask != null && <View style={{ flex: 1, flexDirection: 'column'}}>
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
                    <Text style={{...styles.boldText,textAlign:'center'}}> -- {selectedTask.bina_adi || ""} -- </Text>
                    { selectedTask.ariza_bildiren_ad_soyad && 
                      <>
                        <Text style={styles.boldText}>Arıza Bildiren </Text>
                        <Text style={styles.detailText}>{selectedTask.ariza_bildiren_ad_soyad}</Text>
                      </>
                    }
                    { selectedTask.ariza_bildiren_telefon && selectedTask.ariza_bildiren_telefon != "+90 (___) ___-__-__" && 
                    <>
                      <Text style={styles.boldText}>Telefon Numarası </Text>
                      <Text style={styles.detailText}>{selectedTask.ariza_bildiren_telefon}</Text>
                    </>
                    
                    }
                    <Text style={styles.boldText}>Açıklama </Text><Text style={styles.detailText}>{selectedTask.is_emri_aciklama}</Text>
                    <Text style={styles.boldText}>Adres </Text><Text style={styles.detailText}>{selectedTask.adres}</Text>
                    
                  </View>
              </ScrollView>
            </View>
            <View style={{height:150, margin:20}}>
              <Button
                disabled={selectedTask.is_emri_durum_key != "open"}
                title="Kabul Et"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={()=> sendFowardTask("1") }
              />
              <Button
                disabled={selectedTask.is_emri_durum_key != "open"}
                title="Reddet"
                icon={<Icon name="cancel" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={ ()=> sendFowardTask("0") }
              />
              <View style={styles.backButton} >
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={back} />
              </View>

            </View>
         
          
        </View>
      }
      {
        tab == 2 && selectedImage != '' && <View style={{ flex: 1, flexDirection: 'column'}}>
          <View style={{ flex: 1}}>
            <View style={styles.container}>
              <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                <Text h5 >İş Emri Arıza Resmi</Text>
                  <View  style={{maxWidth:150,backgroundColor:getColor(selectedTask.is_emri_durum_key),borderRadius:20,paddingLeft:10,paddingRight:10,paddingBottom:5,paddingTop:5}}>
                  <Text2 ellipsizeMode='tail'  numberOfLines={1} style={{color:'#fff'}}>
                    {selectedTask.is_emri_durum_adi}
                  </Text2>
                </View>
              </View>
              <View style={styles.divider} ></View>
            </View>
            <ScrollView>
              <View style={{margin:20}}>
                <Image
                    source={{ uri: Settings.baseUrl.replace("/mobile/","") + "/firmaImages/"+selectedTask.firma_id+"/"+selectedImage }} 
                    containerStyle={styles.item}
                  />
              </View>
            </ScrollView>
          </View>
          <View style={{height:50, margin:20, display:'flex'}}>
            
            <View style={styles.backButton} >
              <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> setTab(1)} />
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
  boldText:{
    fontWeight:900
  }
});

export default FowardTask;