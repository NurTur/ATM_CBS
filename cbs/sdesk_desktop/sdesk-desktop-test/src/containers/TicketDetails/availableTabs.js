export const getTabs = (type) => {
	switch (type) {
	case 1: // M - Заявки по договорам
	case 2: // R - Заявки на ремонт блоков в РВП
	case 4: // S - Заявки по разовым заказам
		return [`detailInfo`, `history`, `needParts`, `installedParts`, `comments`]
	case 5: // Q - Заявки по оперативным поставкам запчастей
	case 6: // L - Заявки на пополнение локального склада
		return [`history`, `generalParts`, `comments`]
	case 3: // P - Заявки на поставку к поставщику
		return [`detailInfo`, `history`, `generalParts`, `comments`]
	case 7: // T - Заявки на доставку дефектов на ремонт
		return [`detailInfo`, `history`, `comments`]
	default:
		return [`history`, `comments`]
	}
}
