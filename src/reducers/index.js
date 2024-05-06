// reducers/index.js
import { combineReducers } from 'redux';
import operationNotificationsReducer from './operationNotificationsReducer'; // import your reducer
import CookieReducer from "./CookieReducer";
// import geofenceReducer from './geofenceReducer';

import userReducer from "./UserReducer";
export default combineReducers({
    operationNotifications: operationNotificationsReducer,
    cookie: CookieReducer,
    user: userReducer,
    // geofences: geofenceReducer,

});