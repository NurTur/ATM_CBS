import React from 'react'
import {DatePicker} from 'antd'
import {DATE_PICKER_FOTMAT} from 'containers/App/constants'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker

function getCorrectMomentValue(value) {
	if (value) {
		return Array.isArray(value)
			? value.map(item => getCorrectMomentValue(item))
			: moment.isMoment(value) ? value : moment(value)
	}

	return null
}

export const DateSelect = ({format = DATE_PICKER_FOTMAT, value, ...props}) =>
	<DatePicker format={format} value={getCorrectMomentValue(value)} {...props} />

export const RangeSelect = ({format = DATE_PICKER_FOTMAT, value, ...props}) =>
	<RangePicker format={format} value={getCorrectMomentValue(value)} {...props} />
