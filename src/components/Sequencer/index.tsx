import { h, Component } from "preact";
import Note from "./Note";
import SequencerSettings from "./InstrumentSettings";
import SequencerGrid from "./SequencerGrid";

import "styles/_sequencer.scss";
declare const Tone: any;

interface SequencerProps {
	length: number;
	// range: number;
	owner: string;
	id: string;

	onSequencerChange?: (change: {
		grid: SequencerNote[][];
		settings: InstrumentSettings;
		id: string;
	}) => void;

	sequencerGrid: SequencerNote[][] | null;
	instrumentSettings: InstrumentSettings | null;
	noteRange: string[];
}
interface SequencerState {
	isPlaying: boolean;

	// Key is a keyword taken by react, so it's noteRange for now
	// Key will be controlled by room/host, hardcoded at Cmaj for now
}

export class Sequencer extends Component<SequencerProps, SequencerState> {
	private part: any;
	private synth = new Tone.PolySynth().toMaster();
	constructor(props: SequencerProps) {
		super(props);

		this.state = {
			isPlaying: false
		};

		const sequencerGrid: SequencerNote[][] = [];
		for (let y = this.props.noteRange.length - 1; y >= 0; y--) {
			sequencerGrid[y] = [];
			for (let x = 0; x < this.props.length; x++) {
				sequencerGrid[y][x] = {
					isActive: false,
					value: this.props.noteRange[y],
					xPosition: x,
					yPosition: y
				};
			}
		}
		if (this.props.instrumentSettings) {
			this.synth.set(this.props.instrumentSettings.synthDetails);
		}
		this.part = new Tone.Part(
			(time: string, note: string) => {
				this.synth.triggerAttackRelease(note, "16n", time);
			},
			[],
			"8n"
		);
		Tone.Transport.schedule(() => this.part.start(Tone.Transport.progress));
		console.log("new sequencer", Tone.Transport.progress, this.part);

		this.onSequencerChange(sequencerGrid);
	}

	public componentDidUpdate(prevProps: SequencerProps, prevState: SequencerState) {
		console.log("component update");
		if (this.props.sequencerGrid !== prevProps.sequencerGrid) {
			console.log("new grid!!!!!!!!");
			this.part.removeAll();
			if (this.props.sequencerGrid) {
				this.props.sequencerGrid.forEach((row, y) =>
					row.forEach((note, x) => {
						if (prevProps.sequencerGrid && note !== prevProps.sequencerGrid[y][x]) {
							// this.toggleNote(x, y, note.value);
						}

						// this.part.add(this.getTimeNotation(note.xPosition), note.value);
					})
				);
			}
		}
		console.log(this.props.owner, this.part);
	}

	public render() {
		const { noteRange, sequencerGrid, owner } = this.props;

		const grid: JSX.Element[] = [];
		if (sequencerGrid) {
			for (let y = noteRange.length - 1; y >= 0; y--) {
				const noteRow = [];
				for (let x = 0; x < sequencerGrid[y].length; x++) {
					noteRow.push(
						<Note
							toggleNote={this.toggleNote}
							xPosition={sequencerGrid[y][x].xPosition}
							yPosition={sequencerGrid[y][x].yPosition}
							noteValue={sequencerGrid[y][x].value}
							isActive={sequencerGrid[y][x].isActive}
						/>
					);
				}
				grid.push(
					<div className="note-row">
						{owner === "self" && <h3 className="note-name">{noteRange[y]}</h3>}
						{noteRow}
					</div>
				);
			}
		}

		return (
			<div id="sequencer-section">
				<section className={`sequencer ${owner === "self" ? "large" : "small"}`}>
					<SequencerGrid
						owner={owner}
						onToggleNote={this.toggleNote}
						sequencerGrid={sequencerGrid}
						noteRange={noteRange}
					/>
					{/*</section>{owner === "self" && (
						// <button className="play-btn" onClick={this.toggleSequence}>
						// 	{this.state.isPlaying ? "stop" : "play"}
						// </button>
					// )}*/}
				</section>
				{owner === "self" && (
					<SequencerSettings
						changeOctave={this.changeOctave}
						changeInstrumentSettings={this.changeInstrumentSettings}
					/>
				)}
			</div>
		);
	}

	private getTimeNotation = (xPosition: number): string =>
		`0:${Math.floor(xPosition / 4)}:${xPosition % 4}`;

	public toggleNote = (xPosition: number, yPosition: number, value: string) => {
		if (this.props.owner !== "self") {
			return;
		}
		const positionNotation = this.getTimeNotation(xPosition);
		const seqGrid = this.props.sequencerGrid;
		if (seqGrid) {
			if (seqGrid[yPosition][xPosition].isActive) {
				this.part.remove(positionNotation);
			} else {
				this.part.add(positionNotation, value);
			}
			seqGrid[yPosition][xPosition].isActive = !seqGrid[yPosition][xPosition].isActive;
			this.onSequencerChange(seqGrid);
		}
	};

	// private toggleSequence = () => {
	// 	this.setState({
	// 		isPlaying: !this.state.isPlaying
	// 	});
	// 	if (!this.state.isPlaying) {
	// 		Tone.Transport.stop();
	// 		console.log("stop");
	// 	} else {
	// 		Tone.Transport.start("+0.1");
	// 		console.log("start");
	// 	}
	// };

	private changeOctave = (octave: number) => {
		const sequencerGrid = this.props.sequencerGrid;
		if (!sequencerGrid) {
			return;
		}
		for (let y = this.props.noteRange.length - 1; y >= 0; y--) {
			for (let x = 0; x < this.props.length; x++) {
				const gridNote = sequencerGrid[y][x];
				let newValue = gridNote.value
					.split("")
					.map((char: string) => {
						return char.replace(/[0-9]+/g, octave.toString());
					})
					.join("");
				gridNote.value = newValue;
			}
		}

		let noteRange = this.props.noteRange;
		noteRange = noteRange.map(note => {
			return note
				.split("")
				.map(char => {
					return char.replace(/[0-9]+/g, octave.toString());
				})
				.join("");
		});
		this.part._events.forEach((event: any) => {
			event.value = event.value.replace(/[0-9]+/g, octave.toString());
		});
		this.onSequencerChange(sequencerGrid);
	};

	public changeInstrumentSettings = (settings: InstrumentSettings) => {
		const synthDetails = {
			...settings.synthDetails
		};
		this.synth.set(synthDetails);
		this.onSequencerChange(this.props.sequencerGrid, settings);
	};

	private onSequencerChange = (
		sequencerGrid: SequencerNote[][] | null = this.props.sequencerGrid,
		instrumentSettings: InstrumentSettings | null = this.props.instrumentSettings
	) => {
		if (!this.props.onSequencerChange || !sequencerGrid || !instrumentSettings) {
			return;
		}
		this.props.onSequencerChange({
			id: this.props.id,
			grid: sequencerGrid,
			settings: instrumentSettings
		});
	};
}
