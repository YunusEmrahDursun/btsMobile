import Workspace from './Workspace';
import { StoreProvider } from './Store';
const  App = () => {
  return (
    <StoreProvider>
      <Workspace/>
    </StoreProvider>
      
  );
}



export default App;