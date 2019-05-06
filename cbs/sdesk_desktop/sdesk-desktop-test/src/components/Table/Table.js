import styled, {css} from 'styled-components'

const scrollStyles = css`
	::-webkit-scrollbar-Rowack {
		border-radius: 10px;
	}
	::-webkit-scrollbar {
		background-color: #fff;
		height: 12px;
		width: 12px;
	}
	::-webkit-scrollbar-thumb {
		background-color: #fff;
		border-radius: 10px;
		border: solid 1px #aaa;
	}
	::-webkit-scrollbar-thumb:hover {
		background-color: #e2eeff;
		border: solid 1px #7ca7e2;
	}
`
export default styled.table`
	background: #fff;
	border-collapse: collapse;
	border: solid 0px;
	display: block;
	height: calc(100% - 42px);
	overflow-x: ${({hideScrolls}) => hideScrolls ? `hidden` : `scroll`};
	overflow-y: hidden;
	width: 100%;

	${scrollStyles}
	&, tbody {
		${scrollStyles}
	}
`
