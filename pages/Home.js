import { useState } from 'react';
import TaskList from './TaskList';
import SelectedTask from './SelectedTask';
import ForwardSupport from './ForwardSupport';
import TaskFinish from './TaskFinish';
import Picture from './Picture';
import Video from './Video';
import ForwardList from './ForwardList';
import FowardTask from './FowardTask';
import FowardTaskRequest from './FowardTaskRequest';
import Dialog from './Dialog'
const  Home = () => {

  const [tab, setTab] = useState('taskList');
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogText, setDialogText] = useState("");
  const [dialogShow, setDialogShow] = useState(false);
  
  return (
    <>

      {/* task liste */}
      { tab == 'taskList' && <TaskList setSelectedTask={setSelectedTask} setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* seçilen task */}
      { tab == 'selectedTask' && <SelectedTask selectedTask={selectedTask}  setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* seçilen task yönlendirme talebi */}
      { tab == 'fowardTaskRequest' && <FowardTaskRequest selectedTask={selectedTask}  setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* servise yönlendir */}
      { tab == 'forwardSupport' && <ForwardSupport selectedTask={selectedTask}  setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* taskı tamamla */}
      { tab == 'taskFinish' && <TaskFinish selectedTask={selectedTask} setSelectedTask={setSelectedTask} setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* fotoğraf çek */}
      { tab == 'picture' && <Picture selectedTask={selectedTask} setSelectedTask={setSelectedTask} setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* kullanıcıya yönlendir */}
      { tab == 'video' && <Video selectedTask={selectedTask} setSelectedTask={setSelectedTask} setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* yönlendirme talebi listesi */}
      { tab == 'forwardList' && <ForwardList setSelectedTask={setSelectedTask} setTab={setTab} dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }

      {/* seçilen forward task */}
      { tab == 'forwardSelect' && <FowardTask selectedTask={selectedTask}  setTab={setTab}  dialog={{ dialogText,setDialogText,dialogShow,setDialogShow}}/> }
     

      <Dialog dialogShow={dialogShow} dialogText={dialogText} setDialogShow={ setDialogShow }/>
    </>
  );
}

export default Home;