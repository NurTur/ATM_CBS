import styled from 'styled-components'

export default styled.div`
	color: rgba(0, 0, 0, 0.85);
	cursor: pointer;
	font-weight: 500;
	padding: 5px 0;
	position: relative;
	transition: all .3s;

	> i {
		margin-right: 5px;
		transform: ${({expanded}) => expanded ? `rotate(90deg)` : `rotate(0deg)`};
		transition: all .5s ease;
	}
`
