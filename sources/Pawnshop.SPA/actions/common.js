import Notifications from 'react-notification-system-redux';
import { CALL_UPLOAD, CALL_DOWNLOAD, CALL_DOWNLOAD_TEMP } from '../middleware/file';
import { CALL_PRINT, CALL_REPORT_HTML, CALL_REPORT_EXCEL } from '../middleware/print';

const createNotification = (title, message) => {
    return {
        position: 'br',
        title: title,
        message: message,
        autoDismiss: 6,
    }
};

export const success = message => dispatch => {
    return dispatch(Notifications.success(createNotification("Выполнено", message)));
};

export const warning = message => dispatch => {
    return dispatch(Notifications.warning(createNotification("Внимание", message)));
};

export const info = message => dispatch => {
    return dispatch(Notifications.info(createNotification("Информация", message)));
};

export const error = message => dispatch => {
    return dispatch(Notifications.error(createNotification("Ошибка", message)));
};

export const requestFail = error => dispatch => {
    if (!error) {
        return;
    }
    let message = (error.data && error.data.messages && error.data.messages.join('\n')) || '';

    return dispatch(Notifications.error(createNotification(`Ошибка ${error.status}`, message)));
};

export const upload = files => dispatch => {
    return dispatch({
        [CALL_UPLOAD]: {
            files: files
        }
    });
};

export const download = file => dispatch => {
    return dispatch({
        [CALL_DOWNLOAD]: {
            file: file
        }
    });
};

export const downloadTemp = file => dispatch => {
    return dispatch({
        [CALL_DOWNLOAD_TEMP]: {
            file: file
        }
    });
};

export const print = component => dispatch => {
    return dispatch({
        [CALL_PRINT]: {
            component: component
        }
    });
};

export const html = query => dispatch => {
    return dispatch({
        [CALL_REPORT_HTML]: {
            query: query
        }
    });
};

export const excel = query => dispatch => {
    return dispatch({
        [CALL_REPORT_EXCEL]: {
            query: query
        }
    });
};