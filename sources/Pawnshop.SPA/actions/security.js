import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const signIn = data => dispatch => {
    return dispatch({
        data: data,
        [CALL_API]: {
            endpoint: 'auth/signin',
            actionType: ActionTypes.AUTH_SIGNIN
        }
    });
};

export const signOut = data => dispatch => {
    return dispatch({
        type: ActionTypes.AUTH_SIGNOUT
    });
};

export const profile = () => dispatch => {
    return dispatch({
        [CALL_API]: {
            endpoint: 'auth/profile',
            actionType: ActionTypes.AUTH_PROFILE
        }
    });
};

export const updateProfile = data => dispatch => {
    return dispatch({
        data: data,
        [CALL_API]: {
            endpoint: 'auth/updateProfile',
            actionType: ActionTypes.AUTH_PROFILE
        }
    });
};

export const updatePassword = data => dispatch => {
    return dispatch({
        data: data,
        [CALL_API]: {
            endpoint: 'auth/updatePassword'
        }
    });
};

export const updateOrganizationConfig = data => dispatch => {
    return dispatch({
        data: data,
        [CALL_API]: {
            endpoint: 'auth/updateOrganizationConfiguration'
        }
    });
};

export const updateBranchConfig = data => dispatch => {
    return dispatch({
        data: data,
        [CALL_API]: {
            endpoint: 'auth/updateBranchConfiguration'
        }
    });
};