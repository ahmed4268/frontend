export const SET_TOKEN = 'SET_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';

export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token,
});

export const removeToken = () => ({
    type: REMOVE_TOKEN,
});
export const SET_USER = 'SET_USER';

export const setUser = (user) => ({
    type: SET_USER,
    payload: user,
});
export const logout = () => {
    return {
        type: 'LOGOUT'
    };
};