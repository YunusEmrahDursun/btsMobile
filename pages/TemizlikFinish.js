import { StyleSheet, View,ScrollView } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button,Input ,ListItem  } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
import Qr from './Qr';
moment.locale('tr');
const  TaskFinish = (props) => {
  const { state, dispatch } = useStoreContext();
  const [maskLoading, setMaskLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [data, setData] = useState(null);
  useEffect(() => {
      getData();
  }, [tab])


  
  const getData = () => { 
    setMaskLoading(true);
    axios.get( Settings.baseUrl + '/temizlikListesi/' ,{ headers: { 'authorization': state.userToken } }
    ).then( (response) =>  {
      try {
        setData(response.data)
        
      } catch (error) {
        
      }
    })
    .catch( (error) => {
      console.log(error);
    }).finally(()=> setMaskLoading(false) )

  }
  const exit = () => { 
    dispatch({ type: 'removeToken' });
  }
 
  return (
    <>
    { tab == 1 && <View style={styles.full}>
        <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
          <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
        </View>

        {
           <View style={{ flex: 1, flexDirection: 'column'}}>
              <View style={{ flex: 1}}>
                <View style={styles.container}>
                  <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
                    <Text h5 >Bina Temizlik</Text>
                    <Icon onPress={getData} type='font-awesome' style={{marginRight:10,marginBottom:2}} name='refresh'  color='#183153' />
                  </View>
                  <View style={styles.divider} ></View>
                </View>
                <ScrollView>
                  <View style={{margin:20}}>
                    { data ? <>
                      <Text style={{...styles.boldText,textAlign:'center'}}> -- {data.bina_adi || ""} -- </Text>
                      <Text style={styles.boldText}>Adres </Text><Text style={styles.detailText}>{data.adres || ""}</Text>
                    </> : <>
                      <View style={styles.noRecord}>
                        
                        <Icon type='font-awesome' style={{marginRight:5,marginBottom:0}} name='exclamation-circle'  color='#183153'/>
                        <Text style={{marginTop:10}}>  Kayıt Bulunamadı. </Text>
                        
                      </View>
                    
                    </>}
                  </View>
                </ScrollView>
              </View>
              <View style={{height:50, margin:20, display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                <Button
                  disabled={data==null}
                  icon={<Icon name="camera" color="white" iconStyle={{ marginRight: 10 }} />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={()=>{setTab(2)}}
                />
                <Button
                  icon={<Icon name="power-off" color="white" />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={exit}
                />
              </View>
                      
            
          </View>
        }

      
      </View>}
    {
      tab == 2 && <Qr data={data} setTab={setTab} dialog={props.dialog}/> 
    }
    
    </>
   
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
    maxWidth:'33%',
    flex:1,
    marginLeft:5,
    marginRight:5
  },
  boldText:{
    fontWeight:900
  }
  
});

export default TaskFinish;