import { StyleSheet, View,ScrollView } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,Icon,Button,Input ,ListItem  } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
import Qr from './Qr';
import Picture from './Picture';
moment.locale('tr');
const  TemizlikFinish = (props) => {
  const { state, dispatch } = useStoreContext();
  const [maskLoading, setMaskLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [data, setData] = useState(null);
  const [form, setForm] = useState({
    files:[]
  })
  useEffect(() => {
    if(tab == 1)
      getData();
  }, [tab])

  useEffect(() => {
    
    const intervalId = setInterval(() => {
      getData();
    }, 30000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
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
      if(error.toJSON().status == 403){
        exit();
      }
      console.log(error);
    }).finally(()=> setMaskLoading(false) )

  }
  const exit = () => { 
    dispatch({ type: 'removeToken' });
  }
  const removeFile = (item) => { 

    setForm({...form,files:form.files.filter(i=> i != item)});

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
                </ScrollView>
              </View>
              <View>
              {  data == null && <Text style={{...styles.boldText,textAlign:'center'}}> -- Bu gün için temizlik kayıdı bulunamadı. -- </Text> }
              {  data &&  data.durum == 'giris' && <Text style={{...styles.boldText,textAlign:'center'}}> -- Giriş yapmak için qr okutunuz. -- </Text> }
              { data &&  data.durum == 'cikis' &&  <Text style={{...styles.boldText,textAlign:'center'}}> -- Çıkış yapmak için fotoğraf ekleyip qr okutunuz. -- </Text> }    
              <View style={{height:100, margin:20, display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                
                <Button
                  disabled={data==null}
                  icon={<Icon name="qr-code-outline" color="white" type= 'ionicon'  />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={()=>{setTab(2)}}
                />
                { data && data.durum == 'cikis' &&<Button disabled={form.files.length >= 3}  onPress={()=>{setTab(3)}} buttonStyle={styles.button}
                    icon={<Icon name="camera" color="white"  />}
                    containerStyle={styles.buttonContainer}/>}
                <Button
                  icon={<Icon name="power-off" color="white" />}
                  buttonStyle={styles.button}
                  containerStyle={styles.buttonContainer}
                  onPress={exit}
                />
              </View>
              </View>
             
                      
            
          </View>
        }

      
      </View>}
      
    {
      tab == 2 && <Qr selectedTask={form}  setSelectedTask={setForm} data={data} setTab={setTab} dialog={props.dialog}/> 
    }
    
    {
        tab == 3 && <Picture selectedTask={form} setSelectedTask={setForm} setTab={setTab} dialog={props.dialog}/> 
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

export default TemizlikFinish;