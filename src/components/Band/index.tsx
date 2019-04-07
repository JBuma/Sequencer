import { h, FunctionalComponent } from "preact";
import { Sequencer } from "../Sequencer/index";

interface BandProps {
	players: { [key: string]: User | undefined };
	noteRange: string[];
}

const Band: FunctionalComponent<BandProps> = (props: BandProps) => {
	const { players, noteRange } = props;
	console.log("Playerlist:", players);
	const playerList = Object.keys(players).map(playerID => {
		const player = players[playerID];
		return (
			player !== undefined && (
				<div className="player">
					<h3>{player.username}</h3>
					<Sequencer
						length={16}
						instrumentSettings={player.instrumentSettings}
						sequencerGrid={player.sequencerNotes}
						noteRange={noteRange}
						owner={player.id}
						id={player.id}
					/>
				</div>
			)
		);
	});

	return (
		<section className="band">
			<h1>This is the real band</h1>
			<div className="players">{playerList}</div>
		</section>
	);
};

export default Band;
