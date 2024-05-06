// import * as actionTypes from '../actions/geofenceAction';
//
// const initialState = {
//     loading: false,
//     geofences: [],
//     error: null,
// };
//
// const geofenceReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case actionTypes.FETCH_GEOFENCES_REQUEST:
//             return { ...state, loading: true };
//         case actionTypes.FETCH_GEOFENCES_SUCCESS:
//             return { ...state, loading: false, geofences: action.payload };
//         case actionTypes.FETCH_GEOFENCES_FAILURE:
//             return { ...state, loading: false, error: action.error };
//         case actionTypes.CREATE_GEOFENCE:
//             return { ...state, geofences: [...state.geofences, action.geofence] };
//         case actionTypes.UPDATE_GEOFENCE:
//             return {
//                 ...state,
//                 geofences: state.geofences.map(geofence =>
//                     geofence.id === action.geofence.id ? action.geofence : geofence
//                 ),
//             };
//         case actionTypes.DELETE_GEOFENCE:
//             return {
//                 ...state,
//                 geofences: state.geofences.filter(geofence => geofence.id !== action.geofenceId),
//             };
//         default:
//             return state;
//     }
// };
//
// export default geofenceReducer;