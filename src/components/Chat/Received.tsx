import { h, Component } from 'preact';

interface ReceivedProps {
	messages: ChatMessage[];
}

export class Received extends Component<ReceivedProps, {}> {
	public render() {
		const messages = this.props.messages.map((message) => {
			return (
				<div className="message">
					<h5 className="username">{message.username}:</h5>
					<p>{message.message}</p>
				</div>
			);
		});
		return (
			<div className="received">
				<h3>Messages</h3>
				<div className="message">
					{messages}
					{this.props.messages}
				</div>
			</div>
		);
	}
}
