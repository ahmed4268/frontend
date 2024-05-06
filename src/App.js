import { Routes, Route } from 'react-router-dom';
import './App.css';
import Newoperation from "./Routes/Newoperation/Newoperation";
import Dachboard from "./Routes/dachbord/dashbord";
import Archive from "./Routes/Archive/Archive";
import Replay from "./Routes/Archive/replay";
import Tracking from "./Routes/tracking/tracking";
import Editopperation from "./component/editoperation/editopperation";
import Tech from "./Plannificateur/tech/tech";
import Conge from "./Plannificateur/conge/conge";
import Veh from "./Plannificateur/veh/veh";
import Track from "./Plannificateur/veh/track";
import Site from "./Plannificateur/site/track";
import EditTech from "./Plannificateur/tech/edittech";
import Editveh from "./Plannificateur/veh/editveh";
import Editconge from "./Plannificateur/conge/editconge";
import NewTech from "./Plannificateur/tech/newtech";
import Time from "./Plannificateur/tech/time";
import Newconge from "./Plannificateur/conge/newconge";
import Newveh from "./Plannificateur/veh/newveh";
import NotAuthorized from './login_logout/NotAuthorized';
import Notauthorized from './login_logout/not-authentificated';
// import RoleBasedRoute from './store/RoleBasedRoute';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import Login from "./login_logout/login";
import ResetPassword from "./login_logout/paswordreset";
import Profil from "./login_logout/Pofil";
import Users from "./Users/User";
import Cheftable from "./Users/Operations_chef";
import {useEffect} from "react";
import Cookies from "js-cookie";

// import Socket from "./Routes/tracking/socket";
const App=() => {
    let user=null;
    useEffect(() => {
        if (localStorage.getItem('user') && !Cookies.get('token')) {
            localStorage.removeItem('user');
        }
    }, []);
    if  (Cookies.get('token') && !localStorage.getItem('user')) {
        Cookies.remove('token');
    }
    if(localStorage.getItem('user')){
     user = JSON.parse(localStorage.getItem('user'));}
  return (

      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
          <Routes>
              <Route path="/resetPassword/:token" element={<ResetPassword/>}/>
              <Route path="*" element={<Login />} />
              {user ? (
                  <>
                      {user.role === 'admin' && (
                          <>

                              <Route path="/resetPassword/:token" component={ResetPassword} />
                              <Route path="/" element={<Dachboard />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/not-authorized" element={<Notauthorized/>} />
              <Route path="/not-authentificated" element={<Notauthorized/>} />
              <Route path="/Profil" element={<Profil />} />
              <Route path="/Users" element={<Users />} />
              <Route path="/chef_operations" element={< Cheftable/>} />
              <Route path="/replay" element={<Replay />} />
              <Route path="/track" element={<Track />} />
              <Route path="/technicians" element={<Tech />} />
              <Route path="/sites" element={<Site />} />
              <Route path="/congés" element={<Conge />} />
              <Route path="/vehicules" element={<Veh/>} />
              <Route path="/new-operation" element={<Newoperation/>} />
              <Route path="/editoperation" element={<Editopperation/>} />
              <Route path="/edittech" element={<EditTech/>} />
              <Route path="/presence" element={<Time/>} />
              <Route path="/editveh" element={<Editveh/>} />
              <Route path="/editconge" element={<Editconge/>} />
              <Route path="/new-technician" element={<NewTech/>} />
              <Route path="/newconge" element={<Newconge/>} />
              <Route path="/new-vehicule" element={<Newveh/>} />

              <Route path="/tracking" element={<Tracking/>} />
                              <Route path="*" element={<NotAuthorized />}/>

                          </>
                      )}
                      {user.role === 'ChefProjet' && (
                          <>
                              <Route path="/resetPassword/:token" component={ResetPassword} />
                              <Route path="/Profil" element={<Profil />} />

                              <Route index element={<Dachboard />} />
                              <Route path="*" element={<NotAuthorized />}/>
                              <Route path="/archive" element={<Archive />} />
                              <Route path="/not-authorized" element={<Notauthorized/>} />
                              <Route path="/not-authentificated" element={<Notauthorized/>} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/replay" element={<Replay />} />
                              <Route path="/new-operation" element={<Newoperation/>} />
                              <Route path="/editoperation" element={<Editopperation/>} />
                              <Route path="/tracking" element={<Tracking/>} />



                              <Route path="/not-authorized" element={<Notauthorized/>} />
                              <Route path="/replay" element={<Notauthorized/>} />
                              <Route path="/track" element={<Notauthorized/>} />
                              <Route path="/technicians" element={<Notauthorized />} />
                              <Route path="/sites" element={<Notauthorized />} />
                              <Route path="/congés" element={<Notauthorized />} />
                              <Route path="/vehicules" element={<Notauthorized/>} />


                              <Route path="/edittech" element={<Notauthorized/>} />
                              <Route path="/presence" element={<Notauthorized/>} />
                              <Route path="/editveh" element={<Notauthorized/>} />
                              <Route path="/editconge" element={<Notauthorized/>} />
                              <Route path="/new-technician" element={<Notauthorized/>} />
                              <Route path="/newconge" element={<Notauthorized/>} />
                              <Route path="/new-vehicule" element={<Notauthorized/>} />


                          </>
                      )}
                      {user.role === 'Planifcateur' && (
                          <>
                              <Route path="/resetPassword/:token" component={ResetPassword} />

                              <Route path="/Profil" element={<Profil />} />

                              <Route index element={<Tech />} />
                              <Route path="*" element={<NotAuthorized />}/>
                              <Route path="/not-authorized" element={<Notauthorized/>} />
                              <Route path="/not-authentificated" element={<Notauthorized/>} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/replay" element={<Replay />} />
                              <Route path="/track" element={<Track />} />
                              <Route path="/technicians" element={<Tech />} />
                              <Route path="/sites" element={<Site />} />
                              <Route path="/congés" element={<Conge />} />
                              <Route path="/vehicules" element={<Veh/>} />
                              <Route path="/edittech" element={<EditTech/>} />
                              <Route path="/presence" element={<Time/>} />
                              <Route path="/editveh" element={<Editveh/>} />
                              <Route path="/editconge" element={<Editconge/>} />
                              <Route path="/new-technician" element={<NewTech/>} />
                              <Route path="/newconge" element={<Newconge/>} />
                              <Route path="/new-vehicule" element={<Newveh/>} />

                              <Route path="/archive" element={<Notauthorized />} />
                              <Route path="/not-authentificated" element={<Notauthorized/>} />

                              <Route path="/replay" element={<Notauthorized />} />
                              <Route path="/new-operation" element={<Notauthorized/>} />
                              <Route path="/editoperation" element={<Notauthorized/>} />
                              <Route path="/tracking" element={<Notauthorized/>} />

                          </>
                      )}

                {/*<Route path="/socket" element={<Socket/>} />*/}
                  </>
              ) : <Route path="*" element={<Login />} />
              }
          </Routes>
          </PersistGate>
      </Provider>



  );
};

export default App;
