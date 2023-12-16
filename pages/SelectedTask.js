import { StyleSheet, View,ScrollView,Text as Text2 } from 'react-native';
import { useState } from 'react';
import { Text,Icon,Button   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import * as Linking from 'expo-linking';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
const  SelectedTask = (props) => {
  const { state, dispatch } = useStoreContext();
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);
  const [maskLoading, setMaskLoading] = useState(false);

  const callPhoneNumber = (phoneNumber) => {
    const phoneNumberWithoutSpaces = phoneNumber.replace(/\s/g, ''); 
  
    const phoneUrl = `tel:${phoneNumberWithoutSpaces}`;
  
    Linking.openURL(phoneUrl)
      .catch((err) => console.error('Telefon arama hatası:', err));
  };

  const convertDateFull = (_value) => {
    return moment(_value).format('Do MMMM YYYY, HH:mm');
  }
 
  const back = () => { 
    props.setTab('taskList');
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


  // const transferTask = () => { 
  //   setMaskLoading(true);
  
  //   axios.post( Settings.baseUrl + '/isEmiriYonlendir/'+selectedTask.is_emri_id,{},{ headers: { 'authorization': state.userToken } }) .then( (response) =>  {
  //     if(response.data?.status == 1){
  //       setDialogText("İş emri transfer isteği iletildi!");
  //       setDialogShow(true);
  //       back();
  //     }
  //     if(response.data?.message){
  //       setDialogText(response.data.message);
  //       setDialogShow(true);
  //     }
  //   })
  //   .catch( (error) => {
  //     console.log(error);
  //   }).finally(()=> {setMaskLoading(false);} )
  // }
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
                  { selectedTask.destek_talebi_id && <>
                    <Text style={{...styles.boldText,textAlign:'center'}}> -- Kabul Edilen Teklif -- </Text>
                      <Text style={styles.boldText}>Firma Adı </Text><Text style={styles.detailText}>{selectedTask.firma_adi || ""}</Text>
                      <Text style={styles.boldText}>Açıklama </Text><Text style={styles.detailText}>{selectedTask.aciklama || ""}</Text>
                      <Text style={styles.boldText}>Fiyat </Text><Text style={styles.detailText}>{selectedTask.fiyat || ""}</Text>
                      {selectedTask.firma_iletisim && <>
                        <Text style={styles.boldText}>Firma İletişim </Text> 
                        <View style={{display:'flex',width:'100%',flexDirection:'row'}}>
                            <Text style={styles.detailText}>{selectedTask.firma_iletisim || ""}</Text>
                            <Icon style={{marginLeft:10}} onPress={()=> callPhoneNumber(selectedTask.firma_iletisim || "")} type='font-awesome'  name='phone'  color='#183153' /> 
                        </View>
                      </>}
                      <View style={styles.divider} ></View>
                  </>}
                  <Text style={{...styles.boldText,textAlign:'center'}}> -- {selectedTask.bina_adi || ""} -- </Text>
                  { selectedTask.ariza_bildiren_ad_soyad && 
                    <>
                      <Text style={styles.boldText}>Arıza Bildiren </Text>
                      <Text style={styles.detailText}>{selectedTask.ariza_bildiren_ad_soyad || ""}</Text>
                    </>
                  }
                  { selectedTask.ariza_bildiren_telefon && selectedTask.ariza_bildiren_telefon != "+90 (___) ___-__-__" && 
                   <>
                      <Text style={styles.boldText}>Telefon Numarası </Text> 
                      <View style={{display:'flex',width:'100%',flexDirection:'row'}}>
                        <Text style={styles.detailText}>{selectedTask.ariza_bildiren_telefon || ""}</Text>
                        <Icon style={{marginLeft:10}} onPress={()=> callPhoneNumber(selectedTask.ariza_bildiren_telefon || "")} type='font-awesome'  name='phone'  color='#183153' /> 
                      </View>
                   </>
                  
                  }
                  <Text style={styles.boldText}>Açıklama </Text><Text style={styles.detailText}>{selectedTask.is_emri_aciklama || ""}</Text>
                  <Text style={styles.boldText}>Adres </Text><Text style={styles.detailText}>{selectedTask.adres || ""}</Text>
                  
                </View>
              </ScrollView>
            </View>
            <View style={{height:100, margin:20, display:'flex'}}>
              <View style={{ display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                <Button
                  disabled={selectedTask.is_emri_durum_key != "open"}
                  icon={<Icon name="check" color="white"  />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={()=> { props.setTab('taskFinish') }}
                />
                <Button
                  disabled={selectedTask.is_emri_durum_key != "open"}
                  icon={<Icon name="arrow-forward" color="white"  />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={()=> {props.setTab('fowardTaskRequest')} }
                />
                <Button
                  disabled={selectedTask.is_emri_durum_key != "open" || selectedTask.destek_talebi_id != null}
                  icon={<Icon name="settings" color="white" />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={()=> { props.setTab('forwardSupport') }}
                />
              </View>
              
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
    marginTop:6,
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
  boldText:{
    fontWeight:900
  }
  
});

export default SelectedTask;