import { StyleSheet, View,TouchableOpacity,Image,Platform  } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button  } from '@rneui/themed';
import { Camera } from 'expo-camera';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
import { manipulateAsync,SaveFormat,FlipType  } from 'expo-image-manipulator'; 

moment.locale('tr');
const  Picture = (props) => {
  const { state, dispatch } = useStoreContext();
  
  const [maskLoading, setMaskLoading] = useState(false);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  async function takePhoto() {
    if (cameraRef) {
      setMaskLoading(true);
      const photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo.uri);
      setMaskLoading(false);
    }
  }
  const createFormData = async (photoUri, compressionQuality) => {
    const filePath = Platform.OS === 'android' ? `file://${photoUri}` : photoUri;
    const fileName = filePath.split('/').pop();
  
    const compressedImage = await manipulateAsync(
      filePath,
      [{ resize: { width: 300, height: 300 } }],
      { compress: 1, format: SaveFormat.JPEG }
    );
    const formData = new FormData();
    formData.append('file', {
      uri: compressedImage.uri,
      type: 'image/jpeg',
      name: fileName,
    });
  
    return formData;
  };

  const  savePhoto = () => { 
    setMaskLoading(true);
    createFormData(photoUri)
    .then((formData) => {
      axios.post(Settings.baseUrl + '/fileUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': state.userToken,
        },
      })
      .then(response => {
        
        if(response.data?.status == 1 ){
          const tempFiles= props.selectedTask.files ? [...props.selectedTask.files] : [];
          tempFiles.push(response.data.message[0].pathName)
          props.setSelectedTask({...props.selectedTask, files:tempFiles})
          setPhotoUri(null);
          props.dialog.setDialogText("Bir Adet Fotoğraf Yüklendi!");
          props.dialog.setDialogShow(true);
          props.setTab(1);
        }else{
          props.dialog.setDialogText("Birşeyler ters gitti!");
          props.dialog.setDialogShow(true);
        }
        
      })
      .catch(error => {
        console.log(error)
        props.dialog.setDialogText("Birşeyler ters gitti!");
        props.dialog.setDialogShow(true);
      }).finally(()=> {setMaskLoading(false);});
    });
   
   
  }
  const takePhotoAgain = () => { 
    setPhotoUri(null);
  }
  
  return (
    <View style={styles.full}>
      <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
        <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
      </View>

      {
         props.selectedTask != null && <View style={{ flex: 1, flexDirection: 'column'}}>
            <View style={{ flex: 1}}>
              <View style={styles.container}>
                <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                  <Text h5 >Fotoğraf Çek</Text>
                  <Icon  style={{marginRight:10,marginBottom:2}} name='camera'  color='#183153' />  
                </View>
                <View style={styles.divider} ></View>
              </View>
              <View style={{margin:20,paddingBottom:50}}>
                
                
                { photoUri != null ? <View style={{...styles.full}}>
                    <View style={{ ...styles.full,flex: 1, alignItems: 'center', justifyContent: 'center',padding:20 }}>
                    <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%'  }} />
                  </View> 
                </View> : <></>}
                
                { hasPermission === true  &&  photoUri==null &&<View  style={styles.full}>
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
              { photoUri && <Button
                title="Tekrar Çek"
                icon={<Icon name="refresh" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={takePhotoAgain}
              />}
              { !photoUri && <Button
                title="Çek"
                icon={<Icon name="camera" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={takePhoto}
              />}
              { photoUri && <Button
                title="Kaydet"
                icon={<Icon name="check" color="white" iconStyle={{ marginRight: 10 }} />}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                onPress={savePhoto}
              />}
              <View style={styles.backButton} >
                <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 ,marginTop:10}}  icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={()=> {props.setTab(1)}} />
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

export default Picture;