import { h, FunctionalComponent } from "preact";
import Note from "./Note";

interface SequencerGridProps {
	sequencerGrid: SequencerNote[][] | null;
	noteRange: string[];
	onToggleNote: (xPosition: number, yPosition: number, value: string) => void;
}

const SequencerGrid: FunctionalComponent<SequencerGridProps> = props => {
	const { noteRange, sequencerGrid, onToggleNote } = props;

	const grid: JSX.Element[] = [];
	if (sequencerGrid) {
		for (let y = noteRange.length - 1; y >= 0; y--) {
			const noteRow = [];
			for (let x = 0; x < sequencerGrid[y].length; x++) {
				noteRow.push(
					<Note
						toggleNote={onToggleNote}
						xPosition={sequencerGrid[y][x].xPosition}
						yPosition={sequencerGrid[y][x].yPosition}
						noteValue={sequencerGrid[y][x].value}
						isActive={sequencerGrid[y][x].isActive}
					/>
				);
			}
			grid.push(
				<div className="note-row">
					<h3 className="note-name">{noteRange[y]}</h3>
					{noteRow}
				</div>
			);
		}
	}

	return <div className="sequencer-grid">{grid}</div>;
};

export default SequencerGrid;
