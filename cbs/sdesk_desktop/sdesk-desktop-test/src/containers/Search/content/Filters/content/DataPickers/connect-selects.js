import {setFilter} from 'containers/Search/state/actions'
import {makeSelectFilterData} from 'containers/Search/state/selectors'

const makeProps = filter => ({
	mapState: {makeSelectValue: makeSelectFilterData(filter, `value`)},
	mapActions: {onChange: value => setFilter(filter, value)}
})

export default {
	ticketType: makeProps(`ticketType`),
	city: makeProps(`city`),
	vendor: makeProps(`vendor`),
	ticketStatus: makeProps(`ticketStatus`),
	customer: makeProps(`customer`),
	serviceType: makeProps(`serviceType`),
	performer: makeProps(`performer`),
	closed: makeProps(`closed`),
	period: makeProps(`period`),
	warranty: makeProps(`warranty`),
	warrantyBeefore: makeProps(`warrantyBeefore`),
	cbsWarranty: makeProps(`cbsWarranty`),
	cbsWarrantyBeefore: makeProps(`cbsWarrantyBeefore`),
	waitBeefore: makeProps(`waitBeefore`),
	typeModel: makeProps(`typeModel`),
	device: makeProps(`device`),
	contractor: makeProps(`contractor`),
	malfunction: makeProps(`malfunction`)
}
