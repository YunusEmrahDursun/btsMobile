import { StyleSheet,View } from 'react-native';
import { Text,Button,Dialog   } from '@rneui/themed';

const CustomDialog = (props) => {
  return (
        <Dialog
            isVisible={props.dialogShow}
            onBackdropPress={() => { setDialogShow(false); }}
        >
            <Dialog.Title style={{alignItems: 'center'}} title='Uyarı!'/>
            <View style={styles.divider} ></View>
            <Text style={{textAlign: 'center',marginTop:5}}>{props.dialogText}</Text>
            <Button color="secondary" style={{  marginTop:20,  alignItems: 'center' }}  type="outline"  title="Kapat" onPress={() => { props.setDialogShow(false); }} />
        </Dialog>
  )
}
const styles = StyleSheet.create({
 
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

export default CustomDialog;