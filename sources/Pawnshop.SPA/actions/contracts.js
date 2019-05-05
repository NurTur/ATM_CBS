import { CALL_API } from '../middleware/api';
import * as ActionTypes from './actionTypes';
import moment from 'moment';

export const list = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/list',
            actionType: ActionTypes.WORKSPACE_LIST
        }
    });
};

export const card = query => dispatch => {
    if (query == 0) {
        let contractDate = moment().startOf('day');
        let contractPeriod = 30;
        let maturityDate = contractDate.clone().add(contractPeriod - 1, 'days').startOf('day');

        return dispatch({
            data: {
                contractDate: contractDate,
                loanPeriod: contractPeriod,
                maturityDate: maturityDate,
                originalMaturityDate: maturityDate,
                collateralType: 20,
                percentPaymentType: 20,
                contractData: {
                    client: {
                        cardType: 10,
                    }
                }
            },
            type: ActionTypes.WORKSPACE_CARD
        });
    }
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/card',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const get = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/card',
        }
    });
};

export const copy = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/copy',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const save = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/save',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const remove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/delete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const undoRemove = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/undoDelete',
            actionType: ActionTypes.WORKSPACE_CARD
        }
    });
};

export const excel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/export'
        }
    });
};

export const print = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/print'
        }
    });
};

export const printAnnuity = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contract/printAnnuity'
        }
    });
};

export const actionSign = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/sign'
        }
    });
};

export const actionProlong = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/prolong'
        }
    });
};

export const actionBuyout = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/buyout'
        }
    });
};

export const actionPartialBuyout = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/partialBuyout'
        }
    });
};

export const actionPartialPayment = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/partialPayment'
        }
    });
};

export const actionSelling = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/selling'
        }
    });
};

export const actionCancel = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/cancel'
        }
    });
};

export const actionTransfer = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/transfer'
        }
    });
};

export const actionMonthlyPayment = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/monthlyPayment'
        }
    });
};

export const actionAnnuityPartialPayment = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/annuityPartialPayment'
        }
    });
};

export const actionAnnuityAddition = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/annuityAddition'
        }
    });
};

export const actionAddition = query => dispatch => {
    return dispatch({
        data: query,
        [CALL_API]: {
            endpoint: 'contractAction/addition'
        }
    });
};