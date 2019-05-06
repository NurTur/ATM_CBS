import {createSelector} from 'reselect'
import {isImmutable} from 'immutable'

export const selectDataPicker = (state) => state.get(`dataPicker`)

export const makeSelectPicker = (name) => createSelector(
	selectDataPicker,
	pickers => isImmutable(pickers) ? pickers.get(name) : null
)
export const makeSelectPickerData = (name, param) => createSelector(
	makeSelectPicker(name),
	picker => isImmutable(picker) ? picker.get(param) : null
)
