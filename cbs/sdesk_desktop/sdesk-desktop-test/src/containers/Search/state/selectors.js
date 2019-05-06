import {createSelector} from 'reselect'

export const selectSearch = (state) => state.get(`search`)

export const makeSelectSearchValue = () => createSelector(
	selectSearch,
	search => search.get(`value`)
)
export const makeSelectSearchField = () => createSelector(
	selectSearch,
	search => search.get(`field`)
)
export const makeSelectHistory = () => createSelector(
	selectSearch,
	search => search.get(`history`)
)

export const makeSelectFilters = () => createSelector(
	selectSearch,
	search => search.get(`filters`)
)
export const makeSelectFilter = (name) => createSelector(
	makeSelectFilters(),
	filters => filters.get(name)
)
export const makeSelectFilterData = (name, param) => createSelector(
	makeSelectFilter(name),
	filter => {
		return filter.get(param)
	}
)

export const makeSelectTags = () => createSelector(
	selectSearch,
	search => search.get(`tags`)
)
export const makeSelectTag = (name) => createSelector(
	makeSelectTags(),
	tags => tags.get(name)
)
export const makeSelectOrderedTags = () => createSelector(
	makeSelectTags(),
	tags => tags
		.sort((a, b) => {
			let result = 0
			a.order > b.order && result ++
			a.order < b.order && result --
			return result
		})
)
export const makeSelectFilterTags = () => createSelector(
	makeSelectOrderedTags(),
	tags => tags
		.filter(tag => tag.visible === true)
		.map(tag => tag.selected)
)

export const makeSelectFilterDataPickers = () => createSelector(
	makeSelectOrderedTags(),
	tags => tags
		.filter(tag => tag.selected === true && tag.visible === true)
		.map(() => null)
)

export const makeSelectSelectedFilterValues = () => createSelector(
	makeSelectFilterDataPickers(),
	makeSelectFilters(),
	(tags, filters) => tags
		.map((value, name) => filters.getIn([name, `value`]))
)