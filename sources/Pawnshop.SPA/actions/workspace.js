import * as ActionTypes from './actionTypes';

export const changeWorkspace = workspace => dispatch => {
    return dispatch({
        type: ActionTypes.WORKSPACE_CHANGE,
        data: workspace
    });
};

export const changeBranch = branch => dispatch => {
    return dispatch({
        type: ActionTypes.BRANCH_CHANGE,
        data: branch
    });
};