import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';

export const contractMonitoring = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'report/contractMonitoring'
        }
    });
};

export const exportContractMonitoring = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'report/exportContractMonitoring'
        }
    });
};

export const accountAnalysis = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'report/accountAnalysis'
        }
    });
};

export const accountAnalysisList = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'report/accountAnalysisList',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const cashOrders = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'report/cashOrders',
        }
    });
};

export const exportAccountAnalysis = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'report/exportAccountAnalysis'
        }
    });
};

export const report = query => dispatch => {
    return dispatch({
        data: {
            reportName: query.reportName,
            reportQuery: JSON.stringify(query.reportQuery)
        },
        [CALL_API]: {
            endpoint: 'report/report'
        }
    });
};
