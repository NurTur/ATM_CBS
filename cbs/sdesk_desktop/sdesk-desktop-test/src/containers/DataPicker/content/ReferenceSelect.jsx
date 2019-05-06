import React from 'react'
import {Select, Spin, Alert} from 'antd'
import {SELECT_MAX_OPTIONS_COUNT, LIMITED_MESSAGE} from '../state/constants'
import {schema, denormalize} from 'normalizr'
import {Map} from 'immutable'

const dataSchema = new schema.Entity(`options`)
const Option = Select.Option

const myFilterOption = (inputValue, option) => {
	const {value, title} = option.props
	const {key} = option
	const searchValue = inputValue.toLowerCase()

	if (key && key.toString() === `LimitedOption`) {
		return true
	}
	else if (key && key.toString().toLowerCase() === searchValue) {
		return true
	}
	else if (value && value.toString().toLowerCase().includes(searchValue)) {
		return true
	}
	else if (title && title.toLowerCase().includes(searchValue)) {
		return true
	}
	return false
}

export default props => {
	const {options, fetching, filterOption, prefix, ...additionalProps} = props
	const data = options && Map.isMap(options) && options.has(`index`)
		? denormalize(options.get(`index`), [dataSchema], Map({options}))
		: null
	const children = data
		? data.map(({id, name}) =>
			<Option key={id} title={name} label={prefix && `${prefix}${name}` || name}>{name}</Option>)
		: []

	if (children.length === SELECT_MAX_OPTIONS_COUNT) {
		children.unshift(
			<Option
				key="LimitedOption"
				disabled={true}>
				<Alert message={LIMITED_MESSAGE} banner={true} />
			</Option>
		)
	}

	const checkedFilterOption = `onSearch` in props
		? false
		: filterOption
			? filterOption
			: myFilterOption

	return <Select
		optionFilterProp="title"
		placeholder="Выберите значение"
		notFoundContent={fetching ? <Spin size="small" /> : `Не найдено`}
		filterOption={checkedFilterOption}
		{...additionalProps}
	>
		{children}
	</Select>
}