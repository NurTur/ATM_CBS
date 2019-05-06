const asyncFilterPlaceholder = `Начните вводить значение`

export default {
	ticketType: {mode: `multiple`, allowClear: true},
	city: {mode: `multiple`, allowClear: true},
	vendor: {mode: `multiple`, allowClear: true},
	ticketStatus: {
		mode: `multiple`,
		allowClear: true,
		placeholder: `Не закрытые`
	},
	customer: {
		mode: `multiple`,
		allowClear: true,
		labelInValue: true,
		placeholder: asyncFilterPlaceholder
	},
	serviceType: {mode: `multiple`, allowClear: true},
	performer: {
		mode: `multiple`,
		allowClear: true,
		labelInValue: true,
		placeholder: asyncFilterPlaceholder
	},
	closed: {allowClear: true},
	period: {},

	warranty: {allowClear: true},
	warrantyBeefore: {},

	cbsWarranty: {allowClear: true},
	cbsWarrantyBeefore: {},

	waitBeefore: {},

	typeModel: {
		mode: `multiple`,
		allowClear: true,
		labelInValue: true,
		placeholder: asyncFilterPlaceholder,
		optionLabelProp: `label`,
	},
	device: {allowClear: true},
	contractor: {allowClear: true},
	malfunction: {
		mode: `multiple`,
		allowClear: true,
		labelInValue: true,
		optionLabelProp: `label`,
	},
}
