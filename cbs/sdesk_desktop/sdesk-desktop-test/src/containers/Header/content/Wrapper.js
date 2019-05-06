import styled from 'styled-components'

export default styled.header`
	background-color:#3679d4;
	height:42px;
	min-width: 1210px;
	position:fixed;
	top:0;
	width:100%;
	z-index: 1000;

    .left-panel>* {
        float: left;
    };

    .right-panel>* {
        float: right;
    };

    button {
        border: 0px;
        margin: 4px 0px 0px 0px;
        background-color:#3679d4;
    };
`