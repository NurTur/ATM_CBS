import styled from 'styled-components'
import Table from './Table'

export default styled(Table)`
	.tableSelectedRow {
		background: #e6f7ff;
	}

	.tableGroupingRow {
		font-weight: bold;
		background-image: repeating-linear-gradient(135deg, #f8f8f8, #f8f8f8 10px, #fefefe 10px, #fefefe 20px);
	}

	thead > tr > th {
		background: #fafafa !important;
	}
`