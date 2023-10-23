import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState,useEffect } from 'react';
import { Text,ListItem,Icon,Button } from '@rneui/themed';
import { useStoreContext } from '../Store';
import Settings from '../Settings';
import axios, * as others from 'axios';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');

const  Home = () => {
  const { state, dispatch } = useStoreContext();
  const [tab, setTab] = useState(1);
  const [taskLoading, setTaskLoading] = useState(false);
  const [data, setData] = useState([])
  const [selectedTask, setSelectedTask] = useState(null);
  useEffect(() => {
    getData();
  }, [])
  
  const getData = () => { 
    setTaskLoading(true);
    axios.get( Settings.baseUrl + '/isEmirleri/' ,{ headers: { 'authorization': state.userToken }
    }).then( (response) =>  {
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
    setTab(2);
    setSelectedTask(_selected);
  }
  const back = () => { 
    setTab(1);
  }
  return (
    <View style={styles.full}>
      {
        tab == 1 && <View style={styles.container}>
          <View style={{display:'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
            <Text h5 >İş Emirleri</Text>
            <Icon type='font-awesome' style={{marginRight:10,marginBottom:2}} name='inbox'  color='#183153'/>
          </View>
          <View style={styles.divider} ></View>
          {
            data.map((item, i) => (
              <ListItem key={i} bottomDivider onPress={()=> openTask(item)}>
                {/* <Icon name={item.icon} /> */}
                <ListItem.Content >
                  <ListItem.Title>
                    <View style={{display:'flex',width:'100%',flexDirection:'row',alignItems: 'center',justifyContent: 'center'}}>
                      <Text style={{width:50}}>{item.is_emri_id}</Text>
                      <Text style={{flex:1,textAlign:'left',width:'100%'}}>{item.bina_adi}</Text>
                    </View>
                  </ListItem.Title>
                </ListItem.Content>
                <Text style={{fontSize:12}}>{convertDate(item.is_emri_olusturma_tarihi)}</Text>
                <ListItem.Chevron />
              </ListItem>
            ))
          }
        </View>
      }
      {
        tab == 2 && selectedTask != null && <View style={styles.container}>

          <Button buttonStyle={{ borderWidth: 0, borderColor: 'transparent', borderRadius: 20 }} style={styles.backButton} icon={{ name: 'arrow-left', type: 'font-awesome', size: 15, color: 'white' }}  onPress={back} />
        </View>
      }

      
    </View>
  );
}

const styles = StyleSheet.create({
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
  }
});

export default Home;