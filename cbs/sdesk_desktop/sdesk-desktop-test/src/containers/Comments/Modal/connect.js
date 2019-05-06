import {connect} from 'react-redux'
import {postComment, editComment} from '../state/actions'

const mapActionsToProps = dispatch => ({
	postComment: ticketId => dispatch(postComment(ticketId)),
	editComment: commentId => dispatch(editComment(commentId))
})

export default connect(null, mapActionsToProps)
