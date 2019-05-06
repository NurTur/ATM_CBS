import React from 'react'
import {Icon} from 'antd'
import Caption from './Caption'
import Content from './Content'
import Wrapper from './Wrapper'

export default class Collapse extends React.Component {
	constructor(props) {
		super(props)
		this.content = null
		this.state = {
			expanded: false,
			height: 0
		}
	}
	componentDidMount() {
		const height = this.content && this.content.scrollHeight
		height && this.setState(() => ({height}))
	}
	onClick() {
		if (this.props.loading) return
		this.setState(() => ({expanded: !this.state.expanded}))
	}
	render() {
		const {title, children, onClick, loading} = this.props
		const type = loading ? `loading` : `right`
		const expanded = this.props.expanded !== undefined
			? this.props.expanded
			: this.state.expanded
		const visible = loading || expanded
		return (
			<Wrapper>
				<Caption expanded={expanded} onClick={onClick || this.onClick.bind(this)}>
					<Icon size="small" type={type}/>{title}
				</Caption>
				<Content visible={visible} height={this.state.height} _ref={el => this.content = el}>
					{children}
				</Content>
			</Wrapper>
		)
	}
}
