import React from 'react'
import Wrapper from './Wrapper'
import RecordCount from './RecordCount'
import DropList from 'components/DropList'

function makeList(size, totalRecords) {
	let prev = 1
	const limit = 10
	const result = [{value: 1, label: `${prev} – ${size}`}]
	const itemCount = Math.ceil(totalRecords / size)
	for (let i = 2; i <= itemCount; i ++) {
		prev = size * (i - 1) + 1
		const product = size * i
		const next = product > totalRecords ? totalRecords : product
		result.push({value: i, label: `${prev} – ${next}`})

		if (i >= limit) {
			result.push({value: itemCount, label: `последняя`})
			break
		}
	}
	return result
}

function makePagesList() {
	const result = []
	const range = [50, 100, 150, 200, 500]
	for (let i = 0; i < range.length; i ++) {
		const value = range[i]
		result.push({value, label: `${value}`})
	}
	return result
}

const Pagination = ({page, onChangePage, onChangeSize}) =>
	<Wrapper>
		<RecordCount>{page.totalRecords > 0 ? `${page.totalRecords} заявок` : ``}</RecordCount>
		<DropList
			onChange={onChangePage}
			options={makeList(page.size, page.totalRecords)}
			value={page.current}
			width="120px"
		/>
		<DropList
			value={page.size}
			options={makePagesList()}
			onChange={onChangeSize}
			width="70px"
		/>
	</Wrapper>

export default Pagination
