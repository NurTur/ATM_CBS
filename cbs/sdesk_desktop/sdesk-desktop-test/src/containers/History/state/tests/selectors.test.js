import {fromJS, List} from 'immutable'
import {HistoryRecord} from 'store/entities/schema'
import {makeSelectTicketHistory} from '../selectors'

describe(`Ticket history store selectors`, () => {
	const date = new Date(`2017-12-22`)
	const store = fromJS({
		entities: {
			ticketHistory: [new HistoryRecord({
				date,
				owner: `Алексей Васильев`,
				performer: `Хокинг Стивен`,
				serviceType: `Оперативное обслуживание`,
				status: `Запрос`,
				statusId: 21
			})],
			tickets: {}
		}
	})

	it(`should select ticket history`, () => {
		const expected = List([{
			date: `22 декабря 2017 06:00:00`,
			owner: `Алексей Васильев`,
			performer: `Хокинг Стивен`,
			serviceType: `Оперативное обслуживание`,
			status: `Запрос`,
			statusId: 21
		}])
		const selectHistory = makeSelectTicketHistory()
		expect(selectHistory(store)).toEqual(expected)
	})
})
