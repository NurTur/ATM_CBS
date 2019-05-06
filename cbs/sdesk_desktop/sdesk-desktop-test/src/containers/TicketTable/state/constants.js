import {fromJS} from 'immutable'

export const SET_COLUMNS = `TicketTable/SET_COLUMNS`
export const SET_CONFIGS = `TicketTable/SET_CONFIGS`
export const SET_GROUPING = `TicketTable/SET_GROUPING`
export const SET_PAGE = `TicketTable/SET_PAGE`
export const SET_INITIAL_PAGE = `TicketTable/SET_INITIAL_PAGE`
export const SET_PAGE_SIZE = `TicketTable/SET_PAGE_SIZE`
export const SET_TOTAL_RECORDS = `TicketTable/SET_TOTAL_RECORDS`
export const SORT_DATA = `TicketTable/SORT_DATA`
export const SWAP_COLUMNS = `TicketTable/SWAP_COLUMNS`
export const SET_LOADING = `TicketTable/SET_LOADING`
export const SET_GROUPING_COLUMN_VISIBILITY = `TicketTable/SET_GROUPING_COLUMN_VISIBILITY`
export const SET_PREVENT_UPDATE = `TicketTable/SET_PREVENT_UPDATE`

export const EXPORT_TICKETS = `TicketTable/Buttons/EXPORT_TICKETS`

export const BASE_FIELDS = {
	ticket: [`id`, `vendorId`, `typeId`]
}

export const sorter = {
	columnKey: `date`,
	order: `ascend`
}

export const initialState = fromJS({
	columns: [],
	positions: [],
	page: {
		current: 1,
		size: 50,
		totalRecords: 0
	},
	groupedBy: {
		column: undefined
	},
	loading: false,
	preventUpdate: false,
	sorter
})

export const reportAdditionalFields = {
	needParts: {label: `Требуемые запчасти`, value: `needParts`, dataIndex: `needParts`},
	instParts: {label: `Установленные запчасти`, value: `instParts`,
		children: [
			{
				title: ``,
				dataIndex: `instParts.spare`
			},
			{
				title: `расходники`,
				dataIndex: `instParts.consump`
			}
		]
	},
	comments: {label: `Комментарии`, value: `comments`,
		children: [
			{
				title: `Инженеры`,
				dataIndex: `comments.engeneer`
			},
			{
				title: `Координаторы`,
				dataIndex: `comments.coordinator`
			},
			{
				title: `Оповещения`,
				dataIndex: `comments.announce`
			},
			{
				title: `Служебные`,
				dataIndex: `comments.service`
			}
		]
	},
	description: {label: `Описание со слов заказчика`, value: `description`,
		dataIndex: `description`
	},
	partName: {label: `Наименование устройства (для R-заявок)`, value: `partName`,
		dataIndex: `partName`
	},
	blockNumber: {label: `Регистрационный номер блока (для R-заявок)`, value: `blockNumber`,
		dataIndex: `blockNumber`
	},
	serialNumber: {label: `Серийный номер блока (для R-заявок)`, value: `serialNumber`,
		dataIndex: `serialNumber`
	},
	closedDate: {label: `Дата закрытия заявки`, value: `closedDate`, dataIndex: `closedDate`},
	equipmentName: {label: `Наименование оборудования`, value: `equipmentName`, dataIndex: `equipmentName`},
	equipmentPlace: {label: `Адрес места установки устройства`, value: `equipmentPlace`,
		dataIndex: `equipment.location`
	}
}

export const reportOptions = Object.keys(reportAdditionalFields).reduce((result, key) => {
	const {label, value} = reportAdditionalFields[key]
	result.push({label, value})
	return result
}, [])