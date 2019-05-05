import "./styles/index.less";

import { init as initViews } from "./views";
import * as reducers from './reducers';

import moment from 'moment';

initViews({
    containerId: "appContainer",
    reducers: reducers
});

moment.locale('ru');
moment.fn.toJSON = function() { return this.format(); }