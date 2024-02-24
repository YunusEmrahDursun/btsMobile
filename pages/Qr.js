import { StyleSheet, View,TouchableOpacity,Image,Platform  } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button  } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
import { BarCodeScanner } from 'expo-barcode-scanner';
moment.locale('tr');
const  Qr = (props) => {
  const { state, dispatch } = useStoreContext();
  
  const [maskLoading, setMaskLoading] = useState(false);
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  
  useEffect(() => {
    (async () => {
        try {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } catch (error) {
          
        }
      
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    try {
      setScanned(true);
      if(props.data.qr == data){
        compeleteTask();
      }
      else{
        props.dialog.setDialogText("QR bina ile eşleşmedi!");
        props.dialog.setDialogShow(true);
      }
    } catch (error) {
      
    }
   
  };

const compeleteTask = () => { 
    try {
      if(props.selectedTask.files.length == 0 && props.data.durum == 'cikis'){
        props.dialog.setDialogText("Lütfen Fotoğraf Ekleyin!");
        props.dialog.setDialogShow(true);
        return;
    }
    setMaskLoading(true);

    axios.post( Settings.baseUrl + ( props.data.durum == 'giris' ? '/temizlikGiris/' : '/temizlikTamamla'),{...props.data,files:props.selectedTask.files},{ headers: { 'authorization': state.userToken,location:state.location } }) .then( (response) =>  {
      if(response.data?.status == 1){
        props.dialog.setDialogText(props.data.durum == 'giris' ? "Giriş Yapıldı!" : "Çıkış Yapıldı");
        if(props.data.durum == 'cikis'){
          props.setSelectedTask({files:[]})
        }
        props.dialog.setDialogShow(true);
        props.setTab(1);
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
    } catch (error) {
      
    }
  
    
  }
  
  return (
    <View style={styles.full}>
      <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
        <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
      </View>

      {
         props.data != null && <View style={{ flex: 1, flexDirection: 'column'}}>
            <View style={{ flex: 1}}>
              <View style={styles.container}>
                <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                  <Text h5 >QR Okut</Text>
                  <Icon  style={{marginRight:10,marginBottom:2}} name='camera'  color='#183153' />  
                </View>
                <View style={styles.divider} ></View>
              </View>
              <View style={{margin:20,paddingBottom:50}}>
                
                { hasPermission === true   &&<View  style={styles.full}>
                  <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                  />
                  {scanned && <Button title={'Tekrar Okutmak için Tıkla!'} onPress={() => setScanned(false)} />}
    
                </View>}
                {
                  hasPermission === false &&  <Text>Kamera Erişimi Yok!</Text>
                }

              </View>
            </View>
            <View style={{height:150, margin:20}}>
            
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
  },
  
});

export default Qr;