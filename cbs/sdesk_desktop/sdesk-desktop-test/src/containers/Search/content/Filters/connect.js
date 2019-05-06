import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {setTag, filteredSearch} from 'containers/Search/state/actions'
import {
	makeSelectFilter,
	makeSelectFilterTags,
	makeSelectFilterDataPickers
} from 'containers/Search/state/selectors'

const props = createStructuredSelector({
	visible: makeSelectFilter(`visible`),
	tags: makeSelectFilterTags(),
	filters: makeSelectFilterDataPickers()
})

const actions = dispatch => ({
	setTag: (name, selected) => dispatch(setTag(name, {selected})),
	runSearch: () => dispatch(filteredSearch())
})

export default Filters => connect(props, actions)(Filters)