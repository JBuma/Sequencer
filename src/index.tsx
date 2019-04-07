import { h, Component, render } from "preact";
import { Sequencer } from "./components/Sequencer/index";

import "./styles/main.scss";
declare const Tone: any;

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
	instrumentSettings: InstrumentSettings | null;
	sequencerNotes: SequencerNote[][] | null;
	noteRange: string[];
}
class App extends Component<{}, MainState> {
	constructor() {
		super();

		this.state = {
			instrumentSettings: defaultInstrumentSettings,
			sequencerNotes: null,
			noteRange: CMajor
		};
	}
	public render() {
		return (
			<main id="main">
				{/* TODO: settings will be controlled by host/room */}
				<Sequencer
					sequencerGrid={this.state.sequencerNotes}
					noteRange={this.state.noteRange}
					instrumentSettings={this.state.instrumentSettings}
					length={16}
					onSequencerChange={this.onSequencerChange}
				/>
			</main>
		);
	}

	private onSequencerChange = (
		sequencerNotes: SequencerNote[][],
		instrumentSettings: InstrumentSettings
	) => {
		this.setState({ instrumentSettings, sequencerNotes });
	};
}

render(<App />, document.getElementById("app") as Element);
