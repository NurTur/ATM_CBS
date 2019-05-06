import {Record, Map, List} from 'immutable'

export const MY_TICKETS_SEARCH_REQUEST = `Search/MY_TICKETS_SEARCH_REQUEST`

export const SIMPLE_SEARCH_REQUEST = `Search/SIMPLE_SEARCH_REQUEST`
export const SEARCH_REQUEST = `Search/SEARCH_REQUEST`
export const SET_SEARCH_FIELD = `Search/SET_SEARCH_FIELD`
export const SET_SEARCH_VALUE = `Search/SET_SEARCH_VALUE`
export const UPDATE_SEARCH_HISTORY = `Search/UPDATE_SEARCH_HISTORY`

export const CLEAR_FILTERS = `Search/CLEAR_FILTERS`
export const SET_FILTER = `Search/SET_FILTER`
export const SET_FILTERS_APPLIED = `Search/SET_FILTERS_APPLIED`
export const SHOW_FILTERS = `Search/SHOW_FILTERS`

export const SET_TAG = `Search/SET_TAG`

export const LOAD_SEARCH = `Search/LOAD_SEARCH`

export const SEARCH_FIELDS = [
	{value: `number`, label: `Номер заявки`},
	{value: `partNumber`, label: `Партномер`},
	{value: `orderNumber`, label: `Номер заказа`},
	{value: `regNumber`, label: `Рег. номер`},
	{value: `serialNumber`, label: `Серийный номер`}
]

export const positions = new List([
	`ticketType`,
	`city`,
	`vendor`,
	`ticketStatus`,
	`customer`,
	`serviceType`,
	`performer`,
	`period`,
	`warranty`,
	`warrantyBeefore`,
	`cbsWarranty`,
	`cbsWarrantyBeefore`,
	`waitBeefore`,
	`typeModel`,
	`device`,
	`contractor`,
	`malfunction`
])

export const HISTORY_LENGTH = 10

export const FilterType = Record({
	value: ``
})

export const TagType = Record({
	order: 0,
	selected: false,
	visible: true
})

const Tags = Record({
	ticketType: new TagType({selected: false, order: 1}),
	city: new TagType({selected: false, order: 2}),
	vendor: new TagType({selected: false, order: 3}),
	ticketStatus: new TagType({order: 4}),
	customer: new TagType({order: 5}),
	serviceType: new TagType({order: 6}),
	performer: new TagType({order: 7}),
	period: new TagType({order: 8}),

	warranty: new TagType({order: 9}),
	warrantyBeefore: new TagType({order: 10}),
	cbsWarranty: new TagType({order: 11}),
	cbsWarrantyBeefore: new TagType({order: 12}),

	waitBeefore: new TagType({order: 13}),
	typeModel: new TagType({order: 14}),
	device: new TagType({order: 15}),
	contractor: new TagType({order: 16}),
	malfunction: new TagType({order: 17})
})

const Filters = Record({
	applied: false,
	visible: true,
	ticketType: new FilterType({value: []}),
	city: new FilterType({value: []}),
	vendor: new FilterType({value: []}),
	ticketStatus: new FilterType({value: []}),
	customer: new FilterType({value: []}),
	serviceType: new FilterType({value: []}),
	performer: new FilterType({value: []}),
	period: new FilterType({value: []}),

	warranty: new FilterType(),
	warrantyBeefore: new FilterType({value: null}),
	cbsWarranty: new FilterType(),
	cbsWarrantyBeefore: new FilterType({value: null}),

	waitBeefore: new FilterType({value: null}),
	typeModel: new FilterType({value: []}),
	device: new FilterType(),
	contractor: new FilterType(),
	malfunction: new FilterType({value: []})
})

const defaultFields = {
	field: SEARCH_FIELDS[0].value,
	value: ``,
	history: new List(),
	positions
}

export const InitialRecord = Record({
	...defaultFields,
	tags: new Tags(),
	filters: new Filters()
})

const InitialMap = Record({
	...defaultFields,
	tags: new Map(new Tags()),
	filters: new Map(new Filters())
})

export const initialState = new InitialMap()
