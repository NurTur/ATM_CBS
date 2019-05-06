import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {makeSelectReference} from 'store/entities/selectors'
import {StyledReferenceSelect} from 'containers/DataPicker/styles'

const props = createStructuredSelector({
	options: makeSelectReference(`vendors`)
})

export default connect(props)(StyledReferenceSelect)