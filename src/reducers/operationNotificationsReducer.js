// reducers/operationNotificationsReducer.js
import { ADD_NOTIFICATION } from '../actions/notificationActions';

const INITIAL_STATE = {
    notifications: [],
    // ...rest of your initial state
};
// Redux action creator

const operationNotificationsReducer = (state = INITIAL_STATE, action) => {
    console.log(state); // Continue logging the state
    switch (action.type) {
        case 'SET_OPERATION_NOTIFICATIONS':
            if (action.payload.operationId === 'notifications') {
                console.error('operationId should not be "notifications"');
                return state;
            }
            return {
                ...state,
                [action.payload.operationId]: {
                    ...state[action.payload.operationId],
                    [action.payload.notificationType]: action.payload.value,
                },
            };
        case ADD_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications ? [...state.notifications, action.payload] : [action.payload],
            };
        case 'CLEAR_NOTIFICATIONS':
            return {
                ...state,
                notifications: [],
            };
        default:
            return state;
    }
};

export default operationNotificationsReducer;