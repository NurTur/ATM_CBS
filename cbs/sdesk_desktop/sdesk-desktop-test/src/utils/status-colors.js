const ticket = {
	'1': {color: `#2cb2f8`, name: `Зарегистрирована`},
	'3': {color: `#458ced`, name: `Назначен исполнитель`},
	'4': {color: `#45b6a7`, name: `Ожидание запчасти`},
	'5': {color: `#1ab354`, name: `Принята к исполнению`},
	'6': {color: `#ff831e`, name: `Ожидание заказчика`},
	'7': {color: `#5c5c5c`, name: `Закрыта`},
	'15': {color: `#5c5c5c`, name: `Неремонтопригоден`},
	'18': {color: `#586ef3`, name: `Внесены изменения`},
	'19': {color: `#5c5c5c`, name: `Аннулирована`},
	'20': {color: `#5c5c5c`, name: `Отказ заказчика`},
	'21': {color: `#2ab1bd`, name: `Запрос`},
	'22': {color: `#6dc030`, name: `В работе`},
	'24': {color: `#5c5c5c`, name: `Восстановлен`},
	'25': {color: `#bfc91f`, name: `Компенсация`},
	'26': {color: `#a2a2a2`, name: `Согласование стоимости ремонта`},
	'27': {color: `#a2a2a2`, name: `Ремонт окончен`},
	'28': {color: `#ef4b4b`, name: `Отменено`},
	'29': {color: `#e0a430`, name: `Отгружено`},
	'30': {color: `#4ba00d`, name: `Доступно`},
	'31': {color: `#ef4b4b`, name: `Возврат поставщику`}
}

export const needParts = {
	'0': {color: `#2ab1bd`, name: `Запрос`},
	'1': {color: `#6dc030`, name: `В работе`},
	'2': {color: `#6dc030`, name: `Доступно`},
	'3': {color: `#ef4b4b`, name: `Отменено`},
	'4': {color: `#2ab1bd`, name: `Согласование стоимости ремонта`},
	'5': {color: `#e0a430`, name: `Отгружено`},
	'6': {color: `gray`, name: `Не использовано`}
}

export const getTicketStatusColor = statusId => ticket[statusId]
	? ticket[statusId].color
	: `gray`

export const getNeedPartStatusColor = statusId => needParts[statusId]
	? needParts[statusId].color
	: `gray`
