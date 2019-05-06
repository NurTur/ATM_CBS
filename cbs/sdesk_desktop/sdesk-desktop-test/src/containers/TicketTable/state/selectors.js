import {createSelector, createStructuredSelector} from 'reselect'
import {denormalize} from 'normalizr'
import {Map} from 'immutable'
import randomString from 'randomstring'
import {columnStatics, columnsSchema} from '../columns'
import {every} from 'utils/convert-fns'
import {ticketSchema} from 'store/entities/schema'
import {
	makeSelectReference,
	makeSelectSelectedTicketId,
	makeSelectTickets as makeSelectTicketEntity
} from 'store/entities/selectors'

export const selectTicketTable = state => state.get(`ticketTable`)

export const makeSelectLoading = () => createSelector(
	selectTicketTable,
	table => table.get(`loading`)
)

const makeSelectPositions = () => createSelector(
	selectTicketTable,
	table => table.get(`positions`)
)

const makeSelectSorter = () => createSelector(
	selectTicketTable,
	table => table.get(`sorter`)
)

export const makeSelectUpdate = () => createSelector(
	selectTicketTable,
	table => table.get(`preventUpdate`)
)

const makeSelectColumnsState = () => createSelector(
	selectTicketTable,
	table => table.get(`columns`)
)

export const makeSelectOrderedColumns = () => createSelector(
	makeSelectColumnsState(),
	makeSelectPositions(),
	(columns, positions) => denormalize(positions, columnsSchema, {columns: columns.toJS()})
)

export const makeSelectColumns = () => createSelector(
	makeSelectOrderedColumns(),
	columns => columns
		.filter(column => column.visible)
		.map(column => ({...columnStatics[column.key], ...column}))
)

export const makeSelectPage = () => createSelector(
	selectTicketTable,
	table => table.get(`page`)
)

export const makeSelectSelectedRow = () => createSelector(
	makeSelectSelectedTicketId(),
	ticketId => ({
		key: `id`,
		value: ticketId
	})
)

const makeSelectGrouping = () => createSelector(
	selectTicketTable,
	state => state.get(`groupedBy`)
)

export const makeSelectGroupingValue = () => createSelector(
	makeSelectGrouping(),
	groupedBy => groupedBy.get(`column`)
)

export const makeSelectGroupingList = () => createSelector(
	makeSelectColumns(),
	columns => columns
		.filter(column => !column.hidden)
		.map(column => ({
			value: column.key,
			label: column.title
		}))
)

export const makeSelectSortColumns = () => createSelector(
	makeSelectColumns(),
	makeSelectSorter(),
	(columns, sorter) => columns.map(column => column.key === sorter.get(`columnKey`)
		? {...column, sortOrder: sorter.get(`order`)}
		: column
	)
)

export const makeSelectVisibleSort = () => createSelector(
	makeSelectSorter(),
	makeSelectColumnsState(),
	(sorter, columns) => columns.get(sorter.get(`columnKey`)).visible
		? sorter
		: Map({columnKey: `id`, order: `asc`})
)

const makeSelectReferences = () => createStructuredSelector({
	cities: makeSelectReference(`cities`),
	customers: makeSelectReference(`customers`),
	equipments: makeSelectReference(`equipments`),
	equipmentTypes: makeSelectReference(`equipmentTypes`),
	serviceTypes: makeSelectReference(`serviceTypes`),
	ticketStatuses: makeSelectReference(`ticketStatuses`),
	ticketTypes: makeSelectReference(`ticketTypes`),
	users: makeSelectReference(`users`)
})

const makeSelectDenormalizedTickets = () => createSelector(
	makeSelectTicketEntity(),
	makeSelectReferences(),
	(tickets, refs) => {
		if (tickets.size === 0) {
			return []
		}
		const references = every(refs, ref => ref.toJS())
		const entities = {tickets: tickets.toJS(), ...references}
		const index = entities.tickets.index
		return denormalize(index, ticketSchema, entities) || []
	}
)

const makeSelectGroupingFunction = () => createSelector(
	makeSelectGroupingValue(),
	makeSelectColumns(),
	(key, columns) => key && columns
		.filter(column => column.key === key)
		.first()
		.getGroupValue
)

const group = (tickets, getGroupingValue) => {
	const result = []
	if (tickets.length > 0) {
		let value = null
		tickets.forEach(ticket => {
			const groupingValue = getGroupingValue(ticket)
			if (groupingValue !== value) {
				value = groupingValue
				result.push({
					groupingValue,
					id: randomString.generate(),
					selectable: false
					// ,			// при добавлении функционала сворачивания и разворачивания
					// children: []  // сгруппированных элементов
				})
			}
			// result[result.length - 1].children.push(ticket)
			result.push(ticket)
		})
	}
	return result
}

export const makeSelectTickets = () => createSelector(
	makeSelectGroupingFunction(),
	makeSelectDenormalizedTickets(),
	(getGroupValue, tickets) => getGroupValue ? group(tickets, getGroupValue) : tickets
)