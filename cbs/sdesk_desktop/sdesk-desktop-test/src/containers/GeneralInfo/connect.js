import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

const props = createStructuredSelector({
	date: () => new Date()
})

const actions = dispatch => ({
	onMount: () => console.log(`Fetch or load data`, dispatch)
})

export default connect(props, actions)
