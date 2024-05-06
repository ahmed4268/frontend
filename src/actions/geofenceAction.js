// import axios from 'axios';
//
// export const FETCH_GEOFENCES_REQUEST = 'FETCH_GEOFENCES_REQUEST';
// export const FETCH_GEOFENCES_SUCCESS = 'FETCH_GEOFENCES_SUCCESS';
// export const FETCH_GEOFENCES_FAILURE = 'FETCH_GEOFENCES_FAILURE';
// export const CREATE_GEOFENCE = 'CREATE_GEOFENCE';
// export const CREATE_GEOFENCE_SUCCESS = 'CREATE_GEOFENCE_SUCCESS'; // Add this line
// export const CREATE_GEOFENCE_FAILURE = 'CREATE_GEOFENCE_FAILURE'; // Add this line
// export const UPDATE_GEOFENCE = 'UPDATE_GEOFENCE';
// export const DELETE_GEOFENCE = 'DELETE_GEOFENCE';
// export const fetchGeofences = () => {
//     return async dispatch => {
//         dispatch({ type: FETCH_GEOFENCES_REQUEST });
//         try {
//             const response = await axios.get('https://demo4.traccar.org/api/geofences', {
//                 headers: {
//                     'Content-Type':'application/json',
//                     'Authorization': 'Basic ' + btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K')
//                 },
//             });
//             dispatch({ type: FETCH_GEOFENCES_SUCCESS, payload: response.data });
//         } catch (error) {
//             dispatch({ type: FETCH_GEOFENCES_FAILURE, error });
//         }
//     };
// };
//
// export const createGeofence = geofence => {
//     return async dispatch => {
//         dispatch({ type: CREATE_GEOFENCE });
//         try {
//             const response = await axios.post('https://demo4.traccar.org/api/geofences', geofence, {
//                 headers: {
//                     'Content-Type':'application/json',
//                     'Authorization': 'Basic ' + btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K')
//                 },
//             });
//             dispatch({ type: CREATE_GEOFENCE_SUCCESS, payload: response.data });
//         } catch (error) {
//             dispatch({ type: CREATE_GEOFENCE_FAILURE, error });
//         }
//     };
// };
// export const updateGeofence = geofence => {
//     return async dispatch => {
//         try {
//             const response = await axios.put(`https://demo4.traccar.org/api/geofences/${geofence.id}`, geofence, {
//                 headers: {
//                     'Content-Type':'application/json',
//                     'Authorization': 'Basic ' + btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K')
//                 },
//             });
//             dispatch({ type: UPDATE_GEOFENCE, geofence: response.data });
//         } catch (error) {
//             console.error(error);
//         }
//     };
// };
//
// export const deleteGeofence = geofenceId => {
//     return async dispatch => {
//         try {
//             await axios.delete(`https://demo4.traccar.org/api/geofences/${geofenceId}`, {
//                 headers: {
//                     'Content-Type':'application/json',
//                     'Authorization': 'Basic ' + btoa('mohamedouesalti080@gmail.com:RZedi!Z9MpqnF@K')
//                 },
//             });
//             dispatch({ type: DELETE_GEOFENCE, geofenceId });
//         } catch (error) {
//             console.error(error);
//         }
//     };
// };