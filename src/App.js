import { Routes, Route } from 'react-router-dom';
import './App.css';
import Newoperation from "./Routes/Newoperation/Newoperation";
import Dachboard from "./Routes/dachbord/dashbord";
import Archive from "./Routes/Archive/Archive";
import Tracking from "./Routes/tracking/tracking";
import Editopperation from "./component/editoperation/editopperation";
const App=() => {
  return (


          <Routes>

              <Route index element={<Dachboard />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/new-operation" element={<Newoperation/>} />
              <Route path="/editoperation" element={<Editopperation/>} />
              <Route path="/tracking" element={<Tracking/>} />

          </Routes>




  );
};

export default App;
