import { h, Component } from "preact";

interface SequencerSettingsProps {
	changeOctave: (octave: number) => void;
	changeInstrumentSettings: (settings: InstrumentSettings) => void;
}
interface SequencerSettingsState {
	settings: InstrumentSettings;
}

export default class SequencerSettings extends Component<
	SequencerSettingsProps,
	SequencerSettingsState
> {
	constructor(props: SequencerSettingsProps) {
		super(props);
		this.state = {
			settings: {
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
			}
		};
	}

	public render() {
		return (
			<section id="instrument-settings">
				<h3>Settings</h3>
				<form className="settings-form">
					<div className="form-group">
						<div className="input-group">
							<label for="octave">Octave:</label>
							<input
								name="octave"
								min="0"
								max="10"
								onInput={this.changeOctave}
								type="number"
								value={this.state.settings.octave}
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="input-group">
							<label for="oscillator-type">Oscillator Type</label>
							<select
								name="oscillator-type"
								id="#oscillator-type"
								value={this.state.settings.synthDetails.oscillator.type}
								onInput={this.changeSettings}
							>
								<option value="sine">Sine</option>
								<option value="square">Square</option>
								<option value="triangle">Triangle</option>
								<option value="sawtooth">Sawtooth</option>
							</select>
						</div>
						<div className="input-group">
							<label for="attack">Attack: </label>
							<input
								type="number"
								name="attack"
								min="0.0001"
								max="1"
								id=""
								value={this.state.settings.synthDetails.envelope.attack}
								onInput={this.changeSettings}
								step="0.0001"
							/>
						</div>
						<div className="input-group">
							<label for="decay">Decay: </label>
							<input
								type="number"
								name="decay"
								min="0.0001"
								max="1"
								id=""
								value={this.state.settings.synthDetails.envelope.decay}
								onInput={this.changeSettings}
								step="0.0001"
							/>
						</div>
						<div className="input-group">
							<label for="sustain">Sustain: </label>
							<input
								type="number"
								name="sustain"
								min="0.0001"
								max="1"
								id=""
								value={this.state.settings.synthDetails.envelope.sustain}
								onInput={this.changeSettings}
								step="0.0001"
							/>
						</div>
						<div className="input-group">
							<label for="release">Release: </label>
							<input
								type="number"
								name="release"
								min="0.0001"
								max="1"
								id=""
								value={this.state.settings.synthDetails.envelope.release}
								onInput={this.changeSettings}
								step="0.0001"
							/>
						</div>
					</div>
				</form>
			</section>
		);
	}

	private changeOctave = (event: Event) => {
		if (event.target === null) {
			return;
		}
		const { settings } = this.state;
		const target = event.target as HTMLInputElement;
		let value = parseInt(target.value);

		// Hardcoded because anything above or below these can't be heard anyway
		if (value < 0) {
			value = 0;
		}
		if (value > 10) {
			value = 10;
		}

		settings.octave = value;
		this.setState({
			settings
		});
		this.props.changeOctave(value);
	};

	private changeSettings = (event: Event) => {
		if (event.target === null) {
			return;
		}
		const target = event.target as HTMLInputElement;
		let settings = this.state.settings;

		if (target.name === "oscillator-type") {
			settings.synthDetails.oscillator.type = target.value;
		} else {
			let val: number = parseFloat(target.value);
			if (val < parseFloat(target.min)) {
				val = parseFloat(target.min);
			}
			if (val > parseFloat(target.max)) {
				val = parseFloat(target.max);
			}
			settings.synthDetails.envelope[target.name] = val;
		}

		this.props.changeInstrumentSettings(settings);
	};
}
