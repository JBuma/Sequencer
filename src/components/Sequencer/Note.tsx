import { h, FunctionalComponent } from "preact";

interface NoteState {
	// isActive: boolean;
}
interface NoteProps {
	// notePosition: number;
	noteValue: string;
	isActive: boolean;
	xPosition: number;
	yPosition: number;
	toggleNote: (xPosition: number, yPosition: number, value: string) => void;
}

const Note: FunctionalComponent<NoteProps> = props => {
	const toggleNote = () => {
		props.toggleNote(props.xPosition, props.yPosition, props.noteValue);
	};

	const positionClass = Math.floor(props.xPosition / 4) % 2 === 0 ? "light" : "dark";

	return (
		<div
			onMouseDown={toggleNote}
			className={`${props.isActive ? "active" : ""} ${positionClass} note`}
		/>
	);
};

export default Note;
