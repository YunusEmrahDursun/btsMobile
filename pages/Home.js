import { useState } from 'react';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import Tab3 from './Tab3';
import Tab4 from './Tab4';
import Tab5 from './Tab5';
import Tab6 from './Tab6';
const  Home = () => {

  const [tab, setTab] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <>
     

      {/* liste */}
      { tab == 1 && <Tab1 setSelectedTask={setSelectedTask} setTab={setTab}/> }

      {/* seçilen task */}
      { tab == 2 && <Tab2 selectedTask={selectedTask}  setTab={setTab}/> }

      {/* servise yönlendir */}
      { tab == 3 && <Tab3 selectedTask={selectedTask}  setTab={setTab}/> }

      {/* taskı tamamla */}
      { tab == 4 && <Tab4 selectedTask={selectedTask} setSelectedTask={setSelectedTask} setTab={setTab}/> }

      {/* fotoğraf çek */}
      { tab == 5 && <Tab5 selectedTask={selectedTask} setSelectedTask={setSelectedTask} setTab={setTab}/> }

      {/* fotoğraf çek */}
      { tab == 6 && <Tab6 selectedTask={selectedTask} setSelectedTask={setSelectedTask} setTab={setTab}/> }
     
    </>
  );
}

export default Home;