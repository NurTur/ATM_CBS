import MalfunctionSelect from './content/MalfunctionSelect.jsx'
import TypeModelSelect from './content/TypeModelSelect'
import {StyledReferenceSelect, StyledDateSelect, StyledRangeSelect} from './styles'
import {compose} from 'redux'
import {connect} from 'react-redux'

import injectSaga from 'utils/inject-saga'
import {DAEMON} from 'utils/constants'
import {searchReference} from 'containers/DataPicker/state/actions'

import {createStructuredSelector} from 'reselect'
import {makeSelectPickerData} from './state/selectors'
import {makeSelectReference} from 'store/entities/selectors'

import saga from './state/saga'

import Select from 'antd/lib/select'

const references = {
	ticketType: `ticketTypes`,
	city: `cities`,
	vendor: `vendors`,
	ticketStatus: `ticketStatuses`,
	serviceType: `serviceTypes`,
	warranty: `booleans`,
	cbsWarranty: `booleans`,
	contractor: `booleans`,
	device: `booleans`,
	customer: null,
	performer: null
}

const dateSelectors = {
	period: `dual`,
	warrantyBeefore: `single`,
	cbsWarrantyBeefore: `single`,
	waitBeefore: `single`
}

const specialSelectors = {
	malfunction: MalfunctionSelect,
	typeModel: TypeModelSelect
}

const makeProps = (mapState, name) => {
	const reference = references[name]
	if (reference === null) {
		return createStructuredSelector({
			value: mapState.makeSelectValue,
			options: makeSelectPickerData(name, `options`),
			fetching: makeSelectPickerData(name, `fetching`)
		})
	}
	else if (dateSelectors[name]) {
		return createStructuredSelector({value: mapState.makeSelectValue})
	}

	return createStructuredSelector({
		value: mapState.makeSelectValue,
		options: makeSelectReference(reference)
	})
}

const makeAction = (mapActions, name) => dispatch => {
	const actions = {
		onChange: event => dispatch(mapActions.onChange(event))
	}
	if (references[name] === null) {
		actions.onSearch = value => dispatch(searchReference(name, value))
	}
	return actions
}

export default (name, mapState, mapActions) => {
	if (references.hasOwnProperty(name)) {
		if (mapState && mapActions) {
			if (references[name] === null) {
				const withSaga = injectSaga({dataPicker: saga}, DAEMON)
				const withConnect = connect(
					makeProps(mapState, name),
					makeAction(mapActions, name))
				return compose(withConnect, withSaga)(StyledReferenceSelect)
			}

			return connect(
				makeProps(mapState, name),
				makeAction(mapActions, name)
			)(StyledReferenceSelect)

		}
	}
	if (dateSelectors.hasOwnProperty(name)) {
		const DatePicker = dateSelectors[name] === `dual`
			? StyledRangeSelect
			: StyledDateSelect

		return connect(
			makeProps(mapState, name),
			makeAction(mapActions, name)
		)(DatePicker)
	}
	if (specialSelectors.hasOwnProperty(name)) {
		return connect(
			makeProps(mapState, name),
			makeAction(mapActions, name)
		)(specialSelectors[name])
	}
	return Select
}