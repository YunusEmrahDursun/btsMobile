import { StyleSheet, View,ScrollView,Text as Text2 } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,ListItem,Icon,Button,Skeleton   } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');

const  TaskList = (props) => {
  const { state, dispatch } = useStoreContext();
  const [taskLoading, setTaskLoading] = useState(false);
  const [data, setData] = useState([])

  const [maskLoading, setMaskLoading] = useState(false);


  
  useEffect(() => {
      getData();
  }, [ state.refreshData])
  
  const getData = () => { 
    setTaskLoading(true);
    axios.get( Settings.baseUrl + '/isEmirleri/' ,{ headers: { 'authorization': state.userToken } }
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
    props.setTab('selectedTask');
    props.setSelectedTask(_selected);
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
                <Text h5 >İş Emirleri</Text>
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
                        <View key={i}  style={styles.listItemDivider} >
                          <ListItem   onPress={()=> openTask(item)} >
                            {/* <Icon name={item.icon} /> */}
                            <ListItem.Content  >
                              <ListItem.Title>
                                <View style={{display:'flex',width:'100%',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                                  <View style={{ marginRight:10,width:10,height:10,borderRadius:20,backgroundColor:getColor(item.is_emri_durum_key) }}/>
                                  <Text style={{width:50}}>{item.is_emri_id}</Text>
                                  <View style={{width:150}}>
                                    <Text2 ellipsizeMode='tail' numberOfLines={1} style={{textAlign:'left'}}>{item.bina_adi}</Text2>
                                  </View>
                                </View>
                              </ListItem.Title>
                            </ListItem.Content>
                            <Text style={{fontSize:12}}>{convertDate(item.is_emri_olusturma_tarihi)}</Text>
                            <ListItem.Chevron />
                          </ListItem>
                        </View>
                      )) :  <View style={styles.noRecord}>
                        
                        <Icon type='font-awesome' style={{marginRight:5,marginBottom:0}} name='exclamation-circle'  color='#183153'/>
                        <Text style={{marginTop:10}}>  Kayıt Bulunamadı. </Text>
                        
                      </View>
                    }
                  </>
                  
                }
              </ScrollView>
          </View>
          <View style={{height:50, margin:20, display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
            
            <Button
              icon={<Icon name="add" color="white"  />}
              onPress={()=> {props.setTab('createTask');}}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
            />

            <Button
              icon={<Icon name="arrow-forward" color="white"  />}
              onPress={()=> {props.setTab('forwardList');}}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
            />

            
            <Button
              icon={<Icon name="power-off" color="white" />}
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              onPress={exit}
            />
          </View>
        </View>
      
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
    maxWidth:'33%',
    flex:1,
    marginLeft:5,
    marginRight:5
    
  },
  listItemDivider:{
    width:'100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 10, 
   
  }
  
});

export default TaskList;