import {compose} from 'redux'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import injectSaga from 'utils/inject-saga'
import {DAEMON} from 'utils/constants'
import {makeSelectFilter, makeSelectHistory} from 'containers/Search/state/selectors'
import {
	findMyTickets,
	setSearchValue,
	setSearchField,
	updateSearchHistory,
	fastSearch,
	applyFilters,
	clearFilters,
	showFilters
} from 'containers/Search/state/actions'
import saga from './state/saga'

const props = createStructuredSelector({
	applyFiltersActive: makeSelectFilter(`applied`),
	history: makeSelectHistory()
})

const actions = dispatch => ({
	inputChange: value => {
		dispatch(setSearchValue(value))
	},
	inputKeyPress: e => {
		if (e.key === `Enter` && e.target.value !== ``) {
			dispatch(updateSearchHistory())
			dispatch(fastSearch())
		}
	},
	selectFieldChange: e => {
		dispatch(setSearchField(e.target.value))
		dispatch(fastSearch())
	},
	showFiltersClick: () => dispatch(showFilters()),
	applyFiltersClick: () => {
		dispatch(applyFilters())
		dispatch(fastSearch())
	},
	clearFiltersClick: () => dispatch(clearFilters()),
	myTicketsClick: () => dispatch(findMyTickets())
})

const withSaga = injectSaga({search: saga}, DAEMON)
const withConnect = connect(props, actions)

export default Search => compose(withSaga, withConnect)(Search)