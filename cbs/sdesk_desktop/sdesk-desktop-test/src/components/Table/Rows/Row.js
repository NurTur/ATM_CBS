import styled from 'styled-components'

export default styled.tr`
	overflow-x: auto;
	white-space: nowrap;

	${({selected}) => selected && `background-color: #d2eafb;`}

	&:nth-child(even) {
		background-color: ${({selected}) => selected ? `background-color: #d2eafb;` : `white`};
	}
`
