import { requestFail } from '../actions/common';
import { signOut } from '../actions/security';

const BASE_URL = '/file/';

function upload({ files }) {
    let form = new FormData();
    for (let inx = 0; inx < files.length; inx++) {
        form.append('file' + inx, files[inx]);
    }

    let token = localStorage.getItem('id_token') || null;
    let config = {
        method: "post",
        body: form,
        headers: {}
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return fetch(BASE_URL, config)
        .then(response => {
            let contentType = response.headers.get('content-type');
            let result;
            if (contentType && contentType.indexOf('json') !== -1) {
                result = response.json();
            } else {
                result = response.text();
            }

            if (!response.ok) {
                return result.then(data => Promise.reject({
                    data: data,
                    status: response.status
                }));
            }

            return result;
        });
}

function download({ file }) {
    let token = localStorage.getItem('id_token') || '';

    window.location = `${BASE_URL}${file.id}?token=${token}`;
}

function downloadTemp({ file }) {
    let token = localStorage.getItem('id_token') || '';

    window.location = `${BASE_URL}/temp/${file.fileName}`;
}

function onFail(error, store) {
    switch (error.status) {
        case 401:
            store.dispatch(signOut());
            break;
    }
    store.dispatch(requestFail(error));
    return null;
}

export const CALL_UPLOAD = Symbol('CALL_UPLOAD');
export const CALL_DOWNLOAD = Symbol('CALL_DOWNLOAD');
export const CALL_DOWNLOAD_TEMP = Symbol('CALL_DOWNLOAD_TEMP');

export default store => next => action => {
    const callUpload = action[CALL_UPLOAD];
    if (callUpload !== undefined) {
        return upload(callUpload).then(null, e => onFail(e, store));
    }
    const callDownload = action[CALL_DOWNLOAD];
    if (callDownload !== undefined) {
        return download(callDownload);
    }
    const callDownloadTemp = action[CALL_DOWNLOAD_TEMP];
    if (callDownloadTemp !== undefined) {
        return downloadTemp(callDownloadTemp);
    }

    return next(action);
}