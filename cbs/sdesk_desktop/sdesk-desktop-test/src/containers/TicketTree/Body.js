import styled from 'styled-components'

export default styled.div`
	height: 140px;
	overflow-x: auto;
	padding: 10px 0px;

	&::-webkit-scrollbar-track {
		border-radius: 10px;
	}
	&::-webkit-scrollbar {
		background-color: #fbfbfb;
		height: 12px;
		width: 12px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #fff;
		border-radius: 10px;
		border: solid 1px #aaa;
	}
	&::-webkit-scrollbar-thumb:hover {
		background-color: #e2eeff;
		border: solid 1px #7ca7e2;
	}
`
