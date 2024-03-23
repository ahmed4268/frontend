import { Routes, Route } from 'react-router-dom';
import './App.css';
import Operation from "./Routes/operation/operation.component";
import Newoperation from "./Routes/Newoperation/Newoperation";
import Dachboard from "./Routes/dachbord/dashbord";
import Archive from "./Routes/Archive/Archive";

const App=() => {
  return (


          <Routes>

              <Route index element={<Dachboard />} />
              <Route path="/archive" element={<Archive />} />
             <Route path="/operation" element={<Operation />} />
              <Route path="/new-operation" element={<Newoperation/>} />
          </Routes>




  );
};

export default App;
