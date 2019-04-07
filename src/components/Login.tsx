import { h, Component } from "preact";
import "styles/_login.scss";

interface LoginProps {
	changeUsername: (username: string) => void;
}

interface LoginState {
	username: string;
}

export class Login extends Component<LoginProps, LoginState> {
	public render() {
		const { changeUsername } = this.props;
		const { username } = this.state;
		return (
			<div className="login-wrapper">
				<div className="login dark">
					<h1>Choose Username</h1>
					<form action="javascript:void(0)" className="choose-username">
						<input onInput={this.handleChange} type="text" name="username" id="choose-username" />
						<button type="button" className="centered" onClick={() => changeUsername(username)}>
							Submit
						</button>
					</form>
				</div>
			</div>
		);
	}

	private handleChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		this.setState({
			username: target.value
		});
	};
}
