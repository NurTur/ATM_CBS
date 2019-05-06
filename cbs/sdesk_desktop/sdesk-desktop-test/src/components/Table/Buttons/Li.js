import styled from 'styled-components'
import addTicket from './icons/add-ticket.png'
import addSimilarTicket from './icons/add-similar-ticket.png'
import addParts from './icons/add-parts.png'
import editTicket from './icons/edit-ticket.png'
import changePerformer from './icons/change-performer.png'
import serviceType from './icons/service-type.png'
import changeTicketStatus from './icons/change-ticket-status.png'
import moreActions from './icons/more-actions.png'

const iconList = {
	addTicket,
	addSimilarTicket,
	addParts,
	editTicket,
	changePerformer,
	serviceType,
	changeTicketStatus,
	moreActions
}
const getIcon = icon => iconList[icon]

export default styled.li`
	background-color: #fff;
	background-image: url(${props => getIcon(props.icon)});
	background-position: 18% 44%;
	background-repeat: no-repeat;
	border-bottom: solid 1px #bbb;
	border-right: solid 1px #bbb;
	border-top: solid 1px #bbb;
	cursor: pointer;
	display: inline-block;
	font-size: 13px;
	height: 28px;
	user-select: none;
	width: 41px;

	&:active {
		background-color: #f8f8f8;
		position: relative;
		top: 1px;
	}
`
