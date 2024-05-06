import{REMOVE_TOKEN,SET_TOKEN} from '../actions/cookieActions'
const initialState = {
    token: null,
};

const rootReducer=(state = initialState, action)=> {
    switch (action.type) {
        case SET_TOKEN:
            return { ...state, token: action.payload };
        case REMOVE_TOKEN:
            return { ...state, token: null };
        default:
            return state;
    }
}
export default rootReducer;