import * as ActionTypes from '../actions/actionTypes';
import decode from 'jwt-decode';

const initialState = () => {
    let token = localStorage.getItem('id_token');
    let branchId = localStorage.getItem('id_branch');
    let isAuthenticated = !!token;
    let permissions = [];
    try {
        if (isAuthenticated) {
            let jwt = decode(token);
            permissions = jwt['devman.Permission'];
        }
    } catch(e) {
    }
    return {
        isAuthenticated, permissions: permissions, profile: null,
        branchId: branchId || null, branchProfile: null,
        configuration: null };
};

const mergeObject = (orgConfig, branchConfig) => {
    let result = Object.assign({}, orgConfig, branchConfig);

    for (let key in result) {
        let resultValue = result[key];
        let orgValue = orgConfig && orgConfig[key];
        let branchValue = branchConfig && branchConfig[key];
        if (typeof orgValue === 'object' && typeof branchValue === 'object') {
            resultValue = mergeObject(orgValue, branchValue)
        } else {
            resultValue =  branchValue || orgValue || null
        }
        result[key] = resultValue;
    }

    return result;
};

export function auth(state = initialState(), action) {
    let branchProfile = null;
    let branchId = null;
    let configuration = null;

    switch (action.type) {
        case ActionTypes.AUTH_SIGNIN:
            localStorage.setItem('id_token', action.data);
            let jwt = decode(action.data);
            return Object.assign({}, state, {
                isAuthenticated: true,
                permissions: jwt['devman.Permission']
            });
        case ActionTypes.AUTH_SIGNOUT:
            localStorage.removeItem('id_token');
            return Object.assign({}, state, {
                isAuthenticated: false,
                profile: null,
                permissions: []
            });
        case ActionTypes.AUTH_PROFILE:
            if (action && action.data && action.data.branches.length > 0) {
                if (state.branchId) {
                    branchProfile = action.data.branches.find(b => b.id == state.branchId);
                }
                if (!branchProfile) {
                    branchProfile = action.data.branches[0];
                }
            }
            if (branchProfile) {
                branchId = branchProfile.id;
                configuration = mergeObject(action.data.organization.configuration, branchProfile.configuration);
            }

            localStorage.setItem('id_branch', branchId);
            return Object.assign({}, state, {
                profile: action.data,
                branchId: branchId,
                branchProfile: branchProfile,
                configuration: configuration
            });
        case ActionTypes.BRANCH_CHANGE:
            if (action && action.data && state.profile.branches.length > 0) {
                if (action.data.id) {
                    branchProfile = state.profile.branches.find(b => b.id == action.data.id);
                }
                if (!branchProfile) {
                    branchProfile = state.profile.branches[0];
                }
            }
            if (branchProfile) {
                branchId = branchProfile.id;
                configuration = mergeObject(state.profile.organization.configuration, branchProfile.configuration);
            }
            localStorage.setItem('id_branch', branchId);
            return Object.assign({}, state, {
                branchId: branchId,
                branchProfile: branchProfile,
                configuration: configuration
            });
    }

    return state;
}