import { StyleSheet, View,TouchableOpacity,Image  } from 'react-native';
import { Video } from 'expo-av';
import { useState,useEffect } from 'react';
import { Text,Icon,Button  } from '@rneui/themed';
import { Camera } from 'expo-camera';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
const  VideoComponent = (props) => {
  const { state, dispatch } = useStoreContext();
  
  const [maskLoading, setMaskLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(props.selectedTask);


  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

 
 
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  
  
  const startRecording = async () => {
    if (cameraRef) {
      try {
        setIsRecording(true);
        const videoRecordPromise = cameraRef.recordAsync();
        if (videoRecordPromise) {
          const data = await videoRecordPromise;
          setVideoUri(data.uri);
          setMaskLoading(false);
        }
      } catch (error) {
        console.error('Video recording error:', error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef) {
      setMaskLoading(true);
      cameraRef.stopRecording();
      setIsRecording(false);
    }
  };
  const createFormData = async (photoUri) => {
    const filePath = Platform.OS === 'android' ? `file://${photoUri}` : photoUri;
    const fileName = filePath.split('/').pop();
    const formData = new FormData();
    formData.append('file', {
      uri: filePath,
      type: 'video/mp4', 
      name: fileName,
    });
  
    return formData;
  };
  const saveVideo = () => { 
    setMaskLoading(true);
    createFormData(videoUri)
    .then((formData) => {
      axios.post(Settings.baseUrl + '/fileUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': state.userToken,
        },
      })
      .then(response => {
        
        if(response.data?.status == 1){
          const tempFiles= selectedTask.files ? [...selectedTask.files] : [];
          tempFiles.push(response.data.message[0].pathName)
          props.setSelectedTask({...selectedTask, files:tempFiles})
          setVideoUri(null);
          props.setTab('taskFinish');
        }else{
          props.dialog.setDialogText("Birşeyler ters gitti!");
          props.dialog.setDialogShow(true);
        }
        
      })
      .catch(error => {
        props.dialog.setDialogText("Birşeyler ters gitti!");
        console.log(error)
        props.dialog.setDialogShow(true);
      }).finally(()=> {setMaskLoading(false);});
    });
  }
  const takeVideoAgain = () => { 
    setVideoUri(null)
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
                  <Text h5 >Video Çek</Text>
                  <Icon  style={{marginRight:10,marginBottom:2}} name='camera'  color='#183153' />  
                </View>
                <View style={styles.divider} ></View>
              </View>
              <View style={{margin:20,paddingBottom:50}}>
                
                
                { videoUri != null ? <View style={{...styles.full}}>
                    <View style={{ ...styles.full,flex: 1, alignItems: 'center', justifyContent: 'center',padding:20 }}>
                      
                       <Video
                        source={{ uri: videoUri }}
                        shouldPlay
                        useNativeControls 
                        style={{ width: "100%", height: "100%" }}
                      />
                  </View> 
                </View> : <></>}
                
                { hasPermission === true  &&  videoUri==null &&<View  style={styles.full}>
                  <Camera  style={{ flex: 1 }}
                    type={Camera.Constants.Type.back}
                    ref={(ref) => setCameraRef(ref)}>
                  </Camera>
                </View>}
                {
                  hasPermission === false &&  <Text>Kamera Erişimi Yok!</Text>
                }

              </View>
            </View>
            <View style={{height:150, margin:20}}>
              { !isRecording && !videoUri && <Button
                title="Başlat"
                icon={<Icon name="camera" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={startRecording}
              />}
              { isRecording && !videoUri && <Button
                title="Durdur"
                icon={<Icon name="refresh" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={stopRecording}
              />}
              { videoUri && <Button
                title="Tekrar Çek"
                icon={<Icon name="refresh" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={takeVideoAgain}
              />}
              { videoUri && <Button
                title="Kaydet"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={saveVideo}
              />}
              <View style={styles.backButton} >
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {props.setTab('taskFinish')}} />
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

export default VideoComponent;