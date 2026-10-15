import './styles/ConversationPending.css'

export default function ConversationPending() {
	return(
		<div className="conversation-pending-wrapper">
			<div className="loader"></div>
			<div className="conversation-pending-text">New conversation. Creating summary...</div>
		</div>
	)
}