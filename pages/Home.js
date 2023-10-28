import { StyleSheet, View,ScrollView,TouchableOpacity } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,ListItem,Icon,Button,Skeleton,Dialog,Input   } from '@rneui/themed';
import { Camera } from 'expo-camera';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
const requiredField = 'Bu alanın doldurulması zorunludur.';
const  Home = () => {
  const { state, dispatch } = useStoreContext();
  const [tab, setTab] = useState(1);
  const [taskLoading, setTaskLoading] = useState(false);
  const [data, setData] = useState([])
  const [selectedTask, setSelectedTask] = useState(null);
  const [title, setTitle] = useState("İş Emirleri");
  const [link, setLink] = useState("isEmirleri");
  const [change, setChange] = useState(true);
  const [maskLoading, setMaskLoading] = useState(false);

  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [formSupport, setFormSupport] = useState({
    aciklama:"",
    iletisim:"",
    fiyat:0
  })
  const [formSupportError, setFormSupportError] = useState({
    aciklama:false,
    iletisim:false,
    fiyat:false,
  })

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  
  useEffect(() => {
    if(tab == 1){
      getData();
    }
  }, [link,tab])
  
  const getData = () => { 
    setTaskLoading(true);
    axios.get( Settings.baseUrl + '/'+link+'/' ,{ headers: { 'authorization': state.userToken } }
    ).then( (response) =>  {
      setData(response.data)
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> setTaskLoading(false) )

  }

  const convertDate = (_value) => { 
    return moment(_value).format('MMM DD');
  }
  const convertDateFull = (_value) => {
    return moment(_value).format('Do MMMM YYYY, HH:mm');
  }
  const openTask = (_selected) => { 
    setTab(2);
    setSelectedTask(_selected);
  }
  const back = () => { 
    setTab(1);
  }
  const openTasks = () => { 
    setTitle("İş Emirleri");
    setLink("isEmirleri");
    setChange(true);
  }
  const closedTasks = () => { 
    setTitle("Tamamlanmış İş Emirleri");
    setLink("tamamlananisEmirleri");
    setChange(false);
  }
  const exit = () => { 
    dispatch({ type: 'removeToken' });
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
    setMaskLoading(true);
  
    axios.post( Settings.baseUrl + '/isEmiriYonlendir/'+selectedTask.is_emri_id,{},{ headers: { 'authorization': state.userToken } }) .then( (response) =>  {
      if(response.data?.status == 1){
        setDialogText("İş emri transfer isteği iletildi!");
        setDialogShow(true);
        back();
      }
      if(response.data?.message){
        setDialogText(response.data.message);
        setDialogShow(true);
      }
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> {setMaskLoading(false);} )
  }
  const supportTask = () => { 
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
      console.log(error);
    }).finally(()=> {setMaskLoading(false);} )
  }
  const formSupportChange = (_name,_value) => { 
    
    const tempError = {...formSupportError}
    tempError[_name] = _value.length == 0;
    setFormSupportError(tempError);
    setFormSupport({...formSupport,[_name]:_value});

  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      // Burada çekilen fotoğrafı kaydedebilirsiniz
      MediaLibrary.saveToLibraryAsync(photo.uri);
    }
  }
  let recording = null;

async function startRecording() {
  if (cameraRef.current) {
    recording = await cameraRef.current.recordAsync();
  }
}

async function stopRecording() {
  if (recording) {
    await cameraRef.current.stopRecording();
    // Burada kaydedilen videoyu kaydedebilirsiniz
    MediaLibrary.saveToLibraryAsync(recording.uri);
  }
}
  return (
    <View style={styles.full}>
      <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
        <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
      </View>
      {
        tab == 1 &&   <View style={{ flex: 1, flexDirection: 'column'}}>
          <View style={{ flex: 1}}>
            <View style={styles.container}>
              <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                <Text h5 >{title}</Text>
                {/* <Icon type='font-awesome' style={{marginRight:10,marginBottom:2}} name='inbox'  color='#183153'/> */}
                <Icon onPress={getData} type='font-awesome' style={{marginRight:10,marginBottom:2}} name='refresh'  color='#183153' />
              </View>
              <View style={styles.divider} ></View>

            </View>
            <ScrollView >
                {
                  taskLoading ? <View style={{marginLeft:10,marginRight:10}}>
                    <View  style={{marginTop:10,flex:1,flexDirection: 'row',alignItems: 'stretch'}} >
                      <Skeleton style={{flex:1,margin:10}}  height={8} />
                      <Skeleton circle style={{margin:5}} width={20} height={20} />
                    </View>
                    <View  style={{marginTop:30,flex:1,flexDirection: 'row',alignItems: 'stretch'}} >
                      <Skeleton style={{flex:1,margin:10}}  height={8} />
                      <Skeleton circle style={{margin:5}} width={20} height={20} />
                    </View>
                    <View  style={{marginTop:30,flex:1,flexDirection: 'row',alignItems: 'stretch'}} >
                      <Skeleton style={{flex:1,margin:10}}  height={8} />
                      <Skeleton circle style={{margin:5}} width={20} height={20} />
                    </View>
                    <View  style={{marginTop:30,flex:1,flexDirection: 'row',alignItems: 'stretch'}} >
                      <Skeleton style={{flex:1,margin:10}}  height={8} />
                      <Skeleton circle style={{margin:5}} width={20} height={20} />
                    </View>
                    <View  style={{marginTop:30,flex:1,flexDirection: 'row',alignItems: 'stretch'}} >
                      <Skeleton style={{flex:1,margin:10}}  height={8} />
                      <Skeleton circle style={{margin:5}} width={20} height={20} />
                    </View>
                  </View> 
                  :
                  <>
                    {
                      data.length != 0 ? data.map((item, i) => (
                        <ListItem key={i} bottomDivider onPress={()=> openTask(item)} style={{marginLeft:10}}>
                          {/* <Icon name={item.icon} /> */}
                          <ListItem.Content >
                            <ListItem.Title>
                              <View style={{display:'flex',width:'100%',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                                <View style={{ marginRight:10,width:10,height:10,borderRadius:20,backgroundColor:getColor(item.is_emri_durum_key) }}/>
                                <Text style={{width:50}}>{item.is_emri_id}</Text>
                                <Text style={{width:50}}>{item.is_emri_id}</Text>
                                <Text style={{flex:1,textAlign:'left',width:'100%'}}>{item.bina_adi}</Text>
                              </View>
                            </ListItem.Title>
                          </ListItem.Content>
                          <Text style={{fontSize:12}}>{convertDate(item.is_emri_olusturma_tarihi)}</Text>
                          <ListItem.Chevron />
                        </ListItem>
                      )) :  <View style={styles.noRecord}>
                        
                        <Icon type='font-awesome' style={{marginRight:5,marginBottom:0}} name='exclamation-circle'  color='#183153'/>
                        <Text style={{marginTop:10}}>  Kayıt Bulunamadı. </Text>
                        
                      </View>
                    }
                  </>
                  
                }
              </ScrollView>
          </View>
          <View style={{height:150, margin:20}}>
            {
              change ? <Button
              title={"Tamamlanan İş Emirlerim"}
              icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
              onPress={closedTasks}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
            /> : <Button
            title={"Açık İş Emirlerim"}
            icon={<Icon name="folder-open" color="white" iconStyle={{ marginRight: 10 }} />}
            onPress={openTasks}
            buttonStyle={styles.button}
            containerStyle={styles.buttonContainer}
          />

            }
            
            <Button
              title="Oturumu Kapat"
              icon={<Icon name="power-off" color="white" iconStyle={{ marginRight: 10 }} />}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              onPress={exit}
            />
          </View>
        </View>

      }
      {
        tab == 2 && selectedTask != null && <View style={{ flex: 1, flexDirection: 'column'}}>
            <View style={{ flex: 1}}>
              <View style={styles.container}>
                <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                  <Text h5 >İş Emri Detayları</Text>
                    <View style={{backgroundColor:getColor(selectedTask.is_emri_durum_key),borderRadius:20,paddingLeft:10,paddingRight:10,paddingBottom:5,paddingTop:5}}>
                    <Text style={{color:'#fff'}}>
                      {selectedTask.is_emri_durum_adi}
                    </Text>
                  </View>
                </View>
                <View style={styles.divider} ></View>
              </View>
              <ScrollView>
                <View style={{margin:20}}>
                  
                  <Text style={styles.detailText}>{`Açıklama: ${selectedTask.is_emri_aciklama}`}</Text>
                  <Text style={styles.detailText}>{`Bina Adı: ${selectedTask.bina_adi}`}</Text>
                  <Text style={styles.detailText}>{`Adres: ${selectedTask.adres}`}</Text>
                  <Text style={styles.detailText}>{`İl: ${selectedTask.il_adi}`}</Text>
                  <Text style={styles.detailText}>{`İlçe: ${selectedTask.ilce_adi}`}</Text>
                  { selectedTask.ariza_bildiren_ad_soyad && <Text style={styles.detailText}>{`Arıza Bildiren: ${selectedTask.ariza_bildiren_ad_soyad}`}</Text>}
                  { selectedTask.ariza_bildiren_telefon && <Text style={styles.detailText}>{`Telefon Numarası: ${selectedTask.ariza_bildiren_telefon}`}</Text>}
                  <Text style={styles.detailText}>{`Oluşturulma Tarihi: ${convertDateFull(selectedTask.is_emri_olusturma_tarihi)}`}</Text>
                </View>
              </ScrollView>
            </View>
            <View style={{height:200, margin:20}}>
              <Button
                disabled={selectedTask.is_emri_durum_key != "open"}
                title="İş Emrini Tamamla"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={()=> { setTab(4) }}
              />
              <Button
                disabled={selectedTask.is_emri_durum_key != "open"}
                title="İş Emrini Yönlendir"
                icon={<Icon name="arrow-forward" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={transferTask}
              />
              <Button
                disabled={selectedTask.is_emri_durum_key != "open"}
                title="Teknik Servise Yönlendir"
                icon={<Icon name="settings" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={()=> { setTab(3) }}
              />
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}} style={styles.backButton} icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={back} />

            </View>
         
          
        </View>
      }

      {
        tab == 3 && selectedTask != null && <View style={{ flex: 1, flexDirection: 'column'}}>
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
              
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}} style={styles.backButton} icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {setTab(2)}} />

            </View>
         
          
        </View>
      }

      {
        tab == 4 && selectedTask != null && <View style={{ flex: 1, flexDirection: 'column'}}>
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
                  <Input onChangeText={(e)=> formSupportChange  ("aciklama",e)} leftIcon={{ type: 'font-awesome', name: 'edit' }} placeholder='Açıklama' errorMessage={formSupportError.aciklama && requiredField} />
                  <View style={{ flex: 1 }}>
                    {
                      hasPermission === true  ? <>
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Camera style={{ flex: 1 }} type={type}>
                              <View
                                style={{
                                  flex: 1,
                                  backgroundColor: 'transparent',
                                  flexDirection: 'row',
                                }}>
                                <TouchableOpacity
                                  style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                  }}
                                  onPress={() => {
                                    setType(
                                      type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                    );
                                  }}>
                                  <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                                </TouchableOpacity>
                              </View>
                            </Camera> 
                          <Button title="Fotoğraf Çek" onPress={takePhoto} />
                          <Button title="Video Kaydı Başlat" onPress={startRecording} />
                          <Button title="Video Kaydı Durdur" onPress={stopRecording} />
                        </View>
                       
                      </>: <View style={styles.noRecord}>
                        
                        <Icon type='font-awesome' style={{marginRight:5,marginBottom:0}} name='exclamation-circle'  color='#183153'/>
                        <Text style={{marginTop:10}}>  Kameraya Erişim Sağlanamadı. </Text>
                        
                      </View>
                    }
                    
                  </View>
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
              
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}} style={styles.backButton} icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {setTab(2)}} />

            </View>
         
          
        </View>
      }

      <Dialog
        isVisible={dialogShow}
        onBackdropPress={() => { setDialogShow(false); }}
      >
        <Dialog.Title style={{alignItems: 'center'}} title='Uyarı!'/>
        <View style={styles.divider} ></View>
        <Text style={{textAlign: 'center',marginTop:5}}>{dialogText}</Text>
        <Button color="secondary" style={{  marginTop:20,  alignItems: 'center' }}  type="outline"  title="Kapat" onPress={() => { setDialogShow(false); }} />
      </Dialog>
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

export default Home;