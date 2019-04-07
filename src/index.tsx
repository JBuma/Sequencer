import { h, Component, render } from "preact";
import { Login } from "./components/Login";
import { Sequencer } from "./components/Sequencer/index";
import { Chat } from "./components/Chat/index";
import Band from "./components/Band/index";

import "./styles/main.scss";
declare const Tone: any;
// import SequencerSettings from './components/Sequencer/InstrumentSettings';

const defaultInstrumentSettings = {
	octave: 4,
	synthDetails: {
		oscillator: {
			type: "sine"
		},
		envelope: {
			attack: 0.001,
			decay: 0.1,
			sustain: 0.5,
			release: 1
		}
	}
};

const CMajor = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

interface MainState {
	user: User;
	webSocket: WebSocket;

	users: { [key: string]: User | undefined };

	chat: {
		messages: ChatMessage[];
	};
	noteRange: string[];
}
class App extends Component<{}, MainState> {
	constructor() {
		super();

		const id = new Date().getMilliseconds().toString() + new Date().getSeconds();
		const username = process.env.NODE_ENV === "production" ? "" : "DEV" + id;
		const ip = process.env.NODE_ENV === "production" ? "localhost" : "192.168.178.37";

		this.state = {
			user: {
				username,
				id: id,
				instrumentSettings: defaultInstrumentSettings,
				sequencerNotes: null
			},
			webSocket: new WebSocket("ws://" + ip + ":8080/?id=" + id, "echo-protocol"),
			users: {},
			chat: {
				messages: []
			},
			noteRange: CMajor
		};
		console.log("I am user id", this.state.user.id);
		this.state.webSocket.onopen = this.onWebsocketOpen;
		this.state.webSocket.onerror = error => {
			console.log(error);
		};
		this.state.webSocket.onmessage = this.onWebsocketMessage;
		Tone.Transport.setLoopPoints(0, "1m");
		Tone.Transport.loop = true;
		Tone.Transport.start("+0.1");
	}
	public render() {
		return this.state.user.username === "" ? (
			<Login changeUsername={this.changeUsername} />
		) : (
			<main id="main">
				{/* TODO: settings will be controlled by host/room */}
				<Sequencer
					// range={12}
					sequencerGrid={this.state.user.sequencerNotes}
					noteRange={this.state.noteRange}
					instrumentSettings={this.state.user.instrumentSettings}
					length={16}
					owner="self"
					onSequencerChange={this.onOwnerSequencerChange}
					id={this.state.user.id}
				/>
				<div className="band">
					<h3>Users</h3>
					<Band noteRange={this.state.noteRange} players={this.state.users} />
				</div>
				<aside id="chat">
					{}
					<Chat
						websocket={this.state.webSocket}
						username={this.state.user.username}
						sendToWebsocket={this.sendToWebsocket}
						messages={this.state.chat.messages}
					/>
				</aside>
			</main>
		);
	}
	private onWebsocketOpen = () => {
		if (this.state.user.username !== "") {
			this.changeUsername(this.state.user.username);
		}
	};

	private changeUsername = (username: string): void => {
		const user = JSON.parse(JSON.stringify(this.state.user));
		user.username = username;
		this.setState({
			user
		});
		this.sendToWebsocket({ type: "FirstConnect", data: user });
	};

	private onWebsocketMessage = (message: MessageEvent) => {
		const websocketData = JSON.parse(message.data) as WebsocketData;
		// console.log("=======Message:", websocketData);
		switch (websocketData.type) {
			case "ChatMessage":
				this.onChatMessage(websocketData.data as ChatMessage);
				// console.log("Chatmessage");
				break;
			case "SequencerChange":
				// console.log("Sequencer change message");
				this.onUserSequencerChange(websocketData.data as User);
				break;
			case "NewUser":
				console.log("New user message", (websocketData.data as User).id);
				this.onNewUser(websocketData.data as User);
				break;
			case "FirstConnect":
				this.onFirstConnect(websocketData.data as { [key: string]: User });
				break;
			case "UserLeft":
				this.onUserLeft(websocketData.data as string);
				break;
			default:
				alert("ERROR: Type not found");
				break;
		}
	};

	private onChatMessage = (message: ChatMessage) => {
		const messages = this.state.chat.messages;
		messages.push(message);
		this.setState({
			chat: {
				messages
			}
		});
	};

	private onFirstConnect = (userList: { [key: string]: User }) => {
		const users: { [key: string]: User } = {};
		for (let key in userList) {
			if (userList[key].id !== this.state.user.id) {
				users[key] = userList[key];
			}
		}
		this.setState({
			users
		});
	};

	private onNewUser = (newUserData: User) => {
		// console.log("New user data", newUserData, this.state.user.id);
		if (newUserData.id !== this.state.user.id) {
			const users = this.state.users;
			users[newUserData.id] = newUserData;
			this.setState({
				users
			});
		}
	};

	private onUserLeft = (userId: string) => {
		const users = this.state.users;
		users[userId] = undefined;
		this.setState({
			users
		});
	};

	private sendToWebsocket = (data: WebsocketData) => {
		const stringifiedData = JSON.stringify(data);
		this.state.webSocket.send(stringifiedData);
	};

	private onUserSequencerChange = (change: User) => {
		if (change.id === this.state.user.id) {
			return;
		}
		console.log(change);
		const users = this.state.users;
		users[change.id] = change;
		this.setState({
			users
		});
	};

	private onOwnerSequencerChange = (change: {
		grid: SequencerNote[][];
		settings: InstrumentSettings;
	}) => {
		const user = this.state.user;
		user.instrumentSettings = change.settings;
		user.sequencerNotes = change.grid;
		this.setState({
			user
		});
		if (this.state.webSocket.readyState) {
			this.sendToWebsocket({ type: "SequencerChange", data: user });
		}
	};
}

render(<App />, document.getElementById("app") as Element);
