import { h, Component } from 'preact';
import { Send } from './Send';
import { Received } from './Received';

import 'styles/_chat.scss';

interface ChatProps {
	websocket: WebSocket;
	username: string;
	sendToWebsocket: (data: WebsocketData) => void;
	messages: ChatMessage[];
}

interface ChatState {
	// messages: ChatMessage[];
}

export class Chat extends Component<ChatProps, ChatState>{
	constructor(props: ChatProps) {
		super(props);

		// this.state = {
		// 	messages: [],
		// }
		// this.props.websocket.onmessage = this.onMessage;
	}
	public render() {
		return (
			<div className="chat">
				<h1 className="title">Hello {this.props.username}</h1>
				<Send sendMessage={this.sendToWebsocket} />
				<Received messages={this.props.messages} />
			</div>
		)
	}
	private sendToWebsocket = (message: string) => {
		let data: WebsocketData = {
			type: "ChatMessage",
			data: {
				message,
				username: this.props.username,
				date: new Date()
			}
		}
		this.props.sendToWebsocket(data);
	}
	// private onMessage = (event: MessageEvent): any => {
	// 	const response: WebsocketData = JSON.parse(event.data);
	// 	if (response.type === 'ChatMessage') {
	// 		const messages = this.state.messages;
	// 		messages.push(response.data as ChatMessage);
	// 		this.setState({
	// 			messages,
	// 		});
	// 	}
	// }
}