declare var process: {
	env: {
		NODE_ENV: string
	}
}

interface WebsocketData {
	type: 'ChatMessage' | 'SequencerChange' | "NewUser" | "FirstConnect" | "UserLeft";
	data: ChatMessage | SequencerChange | User | { [key: string]: User | undefined } | string;
}

interface ChatMessage {
	message: string;
	date: Date;
	username: string;
}

interface SequencerChange {
	user: User;
}

interface User {
	username: string;
	id: string;
	instrumentSettings: InstrumentSettings | null;
	sequencerNotes: SequencerNote[][] | null;
}



interface InstrumentSettings {
	octave: number;
	synthDetails: {
		oscillator: {
			type: string
		},
		envelope: {
			[key: string]: number,
			attack: number,
			decay: number,
			sustain: number,
			release: number
		}
	}
}

interface SequencerNote {
	isActive: boolean;
	value: string;
	xPosition: number;
	yPosition: number;
}

