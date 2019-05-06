import {compose} from 'redux'
import {connect} from 'react-redux'
import injectSaga from 'utils/inject-saga'
import {DAEMON} from 'utils/constants'
import saga from 'containers/DataPicker/state/saga'
import {searchReference, setPickerData} from 'containers/DataPicker/state/actions'
import {createStructuredSelector} from 'reselect'
import {makeSelectPickerData} from 'containers/DataPicker/state/selectors'
import {StyledReferenceSelect} from 'containers/DataPicker/styles'

const actions = {
	searchReference,
	setPickerData,
}

export default Component => compose(
	injectSaga({dataPicker: saga}, DAEMON),
	connect(null, actions),
)(Component)

const getProps = reference => createStructuredSelector({
	options: makeSelectPickerData(reference, `options`),
	fetching: makeSelectPickerData(reference, `fetching`)
})

export const getComponent = reference => connect(getProps(reference))(StyledReferenceSelect)