export interface RawMidi {
  formatType: number;
  tracks: number;
  track: Event[];
  timeDivision: number;
  [x: string]: any;
}

interface Event {
  event: MidiEvent[];
}
[];

interface MidiEvent {
  deltaTime: number;
  type: number;
  channel: number;
  data: [number, number];
}

export type ProcessedMidi = ProcessedMidiEvent[];

interface ProcessedMidiEvent {
  time: number; // in seconds
  pitch: number;
  press: boolean; // true if attack, false if release
}

export type SimplifiedMidi = SimplifiedMidiEvent[];

export interface SimplifiedMidiEvent {
  onset: number; // in seconds
  offset: number; // in seconds
  pitch: number;
}

export type NotesInfo = NotesPressed[];

export interface NotesPressed {
  time: number; // in seconds
  notes: number[]; // array of current notes pressed
}
