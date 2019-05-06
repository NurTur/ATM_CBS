import {combineReducers} from 'redux-immutable'
import globalReducer from './global/reducer'
import entityReducer from './entities/reducer'
import pickersReducer from 'containers/DataPicker/state/reducer'
import searchReducer from 'containers/Search/state/reducer'
import ticketTableReducer from 'containers/TicketTable/state/reducer'
import ticketTreeReducer from 'containers/TicketTree/state/reducer'
import ticketDetailsReducer from 'containers/TicketDetails/state/reducer'
import commentsTabReducer from 'containers/Comments/state/reducer'

export default function createReducer(injectedReducers) {
	return combineReducers({
		global: globalReducer,
		entities: entityReducer,
		dataPicker: pickersReducer,
		search: searchReducer,
		ticketTable: ticketTableReducer,
		ticketTree: ticketTreeReducer,
		ticketDetails: ticketDetailsReducer,
		commentsTab: commentsTabReducer,
		...injectedReducers
	})
}
