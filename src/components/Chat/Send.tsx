import { h, Component } from 'preact';

interface SendProps {
	sendMessage: (message: string) => void;
}

interface SendState {
	message: string;
}

export class Send extends Component<SendProps, SendState> {
	public render() {
		return (
			<div className="output">
				<h3>Send</h3>
				<input onInput={this.handleChange} type="text" name="send" id="send-message" onKeyDown={this.onKeyDown} />
				<button onClick={this.sendMessage}>Send</button>
			</div>
		);
	}

	private handleChange = (e: Event) => {
		if (e.target === null) {
			return;
		}
		const target = e.target as HTMLInputElement;
		this.setState({
			message: target.value,
		});
	}
	private onKeyDown = (e: KeyboardEvent) => {
		if (e.keyCode === 13) {
			this.sendMessage();
		}
	}

	private sendMessage = () => {
		this.props.sendMessage(this.state.message);
		(document.getElementById('send-message') as HTMLInputElement).value = '';
	}
}
