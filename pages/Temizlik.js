import { useState } from 'react';

import Dialog from './Dialog'
import TemizlikFinish from './TemizlikFinish';
const  Temizlik = () => {

  const [tab, setTab] = useState('temizlikFinish');
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);
  
  return (
    <>

        {/* taskı tamamla */}
        { tab == 'temizlikFinish' && <TemizlikFinish selectedTask={selectedTask} setSelectedTask={setSelectedTask} setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }


      <Dialog dialogShow={dialogShow} dialogText={dialogText} setDialogShow={ setDialogShow }/>
    </>
  );
}

export default Temizlik;