import { StyleSheet, View,ScrollView,Text as Text2 } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,ListItem,Icon,Button,Skeleton   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import Dialog from './Dialog'
import 'moment/locale/tr';
moment.locale('tr');

const  Tab1 = (props) => {
  const { state, dispatch } = useStoreContext();
  const [taskLoading, setTaskLoading] = useState(false);
  const [data, setData] = useState([])

  const [title, setTitle] = useState("İş Emirleri");
  const [link, setLink] = useState("isEmirleri");
  const [change, setChange] = useState(true);
  const [maskLoading, setMaskLoading] = useState(false);

  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);

  
  useEffect(() => {
      getData();
  }, [link, state.refreshData])
  
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
 
  const openTask = (_selected) => { 
    props.setTab(2);
    props.setSelectedTask(_selected);
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
  
  return (
    <View style={styles.full}>
      <View style={{...styles.mask,display: maskLoading ? '': 'none'}}>
        <Button title="Solid" type="solid" loading buttonStyle={{backgroundColor:'#00000000'}}/>
      </View>
       <View style={{ flex: 1, flexDirection: 'column'}}>
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
                                <View style={{width:150}}>
                                  <Text2 ellipsizeMode='tail' numberOfLines={1} style={{textAlign:'left'}}>{item.bina_adi}asdadasd</Text2>
                                </View>
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
      
      <Dialog dialogShow={dialogShow} dialogText={dialogText} setDialogShow={ setDialogShow }/>
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

export default Tab1;