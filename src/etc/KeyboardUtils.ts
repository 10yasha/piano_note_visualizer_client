import { SimplifiedMidi } from "../types/MidiTypes";

// Based on:
// https://inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies
export const midiNumToName = new Map([
  [21, "A0"],
  [22, "A#0"],
  [23, "B0"],
  // octave 1
  [24, "C1"],
  [25, "C#1"],
  [26, "D1"],
  [27, "D#1"],
  [28, "E1"],
  [29, "F1"],
  [30, "F#1"],
  [31, "G1"],
  [32, "G#1"],
  [33, "A1"],
  [34, "A#1"],
  [35, "B1"],
  // octave 2
  [36, "C2"],
  [37, "C#2"],
  [38, "D2"],
  [39, "D#2"],
  [40, "E2"],
  [41, "F2"],
  [42, "F#2"],
  [43, "G2"],
  [44, "G#2"],
  [45, "A2"],
  [46, "A#2"],
  [47, "B2"],
  // octave 3
  [48, "C3"],
  [49, "C#3"],
  [50, "D3"],
  [51, "D#3"],
  [52, "E3"],
  [53, "F3"],
  [54, "F#3"],
  [55, "G3"],
  [56, "G#3"],
  [57, "A3"],
  [58, "A#3"],
  [59, "B3"],
  // octave 4
  [60, "C4"],
  [61, "C#4"],
  [62, "D4"],
  [63, "D#4"],
  [64, "E4"],
  [65, "F4"],
  [66, "F#4"],
  [67, "G4"],
  [68, "G#4"],
  [69, "A4"],
  [70, "A#4"],
  [71, "B4"],
  // octave 5
  [72, "C5"],
  [73, "C#5"],
  [74, "D5"],
  [75, "D#5"],
  [76, "E5"],
  [77, "F5"],
  [78, "F#5"],
  [79, "G5"],
  [80, "G#5"],
  [81, "A5"],
  [82, "A#5"],
  [83, "B5"],
  // octave 6
  [84, "C6"],
  [85, "C#6"],
  [86, "D6"],
  [87, "D#6"],
  [88, "E6"],
  [89, "F6"],
  [90, "F#6"],
  [91, "G6"],
  [92, "G#6"],
  [93, "A6"],
  [94, "A#6"],
  [95, "B6"],
  // octave 7
  [96, "C7"],
  [97, "C#7"],
  [98, "D7"],
  [99, "D#7"],
  [100, "E7"],
  [101, "F7"],
  [102, "F#7"],
  [103, "G7"],
  [104, "G#7"],
  [105, "A7"],
  [106, "A#7"],
  [107, "B7"],
  // high C
  [108, "C8"],
]);

// for drawing, this returns the center x-coors of each note given the spacing in px of a white key
export const getNoteSpacingMap = (spacing: number) => {
  const s = spacing; // spacing
  const hs = spacing/2; // half spacing
  
  const leftXCoors = new Map([
    [21, 0], // "A0"
    [22, hs], // "A#0"
    [23, s], // "B0"
    // octave 1 => 2s
    [24, 2*s], // "C1"
    [25, 2*s+hs], // "C#1"
    [26, 3*s], // "D1"
    [27, 3*s+hs], // "D#1"
    [28, 4*s], // "E1"
    [29, 5*s], // "F1"
    [30, 5*s+hs], // "F#1"
    [31, 6*s], // "G1"
    [32, 6*s+hs], // "G#1"
    [33, 7*s], // "A1"
    [34, 7*s+hs], // "A#1"
    [35, 8*s], // "B1"
    // octave 2 => 9s
    [36, 9*s], // "C2"
    [37, 9*s+hs], // "C#2"
    [38, 10*s], // "D2"
    [39, 10*s+hs], // "D#2"
    [40, 11*s], //"E2"
    [41, 12*s], // "F2"
    [42, 12*s+hs], // "F#2"
    [43, 13*s], // "G2"
    [44, 13*s+hs], // "G#2"
    [45, 14*s], // "A2"
    [46, 14*s+hs], // "A#2"
    [47, 15*s], // "B2"
    // octave 3 => 16s
    [48, 16*s], // "C3"
    [49, 16*s+hs], // "C#3"
    [50, 17*s], // "D3"
    [51, 17*s+hs], // "D#3"
    [52, 18*s], // "E3"
    [53, 19*s], // "F3"
    [54, 19*s+hs], // "F#3"
    [55, 20*s], // "G3"
    [56, 20*s+hs], // "G#3"
    [57, 21*s], // "A3"
    [58, 21*s+hs], // "A#3"
    [59, 22*s], // "B3"
    // octave 4 => 23s
    [60, 23*s], // "C4"
    [61, 23*s+hs], // "C#4"
    [62, 24*s], // "D4"
    [63, 24*s+hs], // "D#4"
    [64, 25*s], // "E4"
    [65, 26*s], // "F4"
    [66, 26*s+hs], // "F#4"
    [67, 27*s], // "G4"
    [68, 27*s+hs], // "G#4"
    [69, 28*s], // "A4"
    [70, 28*s+hs], // "A#4"
    [71, 29*s], // "B4"
    // octave 5 => 30s
    [72, 30*s], // "C5"
    [73, 30*s+hs], // "C#5"
    [74, 31*s], // "D5"
    [75, 31*s+hs], // "D#5"
    [76, 32*s], // "E5"
    [77, 33*s], // "F5"
    [78, 33*s+hs], // "F#5"
    [79, 34*s], // "G5"
    [80, 34*s+hs], // "G#5"
    [81, 35*s], // "A5"
    [82, 35*s+hs], // "A#5"
    [83, 36*s], // "B5"
    // octave 6 => 37s
    [84, 37*s], // "C6"
    [85, 37*s+hs], // "C#6"
    [86, 38*s], // "D6"
    [87, 38*s+hs], // "D#6"
    [88, 39*s], // "E6"
    [89, 40*s], // "F6"
    [90, 40*s+hs], // "F#6"
    [91, 41*s], // "G6"
    [92, 41*s+hs], // "G#6"
    [93, 42*s], // "A6"
    [94, 42*s+hs], // "A#6"
    [95, 43*s], // "B6"
    // octave 7 => 44s
    [96, 44*s], // "C7"
    [97, 44*s+hs], // "C#7"
    [98, 45*s], // "D7"
    [99, 45*s+hs], // "D#7"
    [100, 46*s], // "E7"
    [101, 47*s], // "F7"
    [102, 47*s+hs], // "F#7"
    [103, 48*s], // "G7"
    [104, 48*s+hs], // "G#7"
    [105, 49*s], // "A7"
    [106, 49*s+hs], // "A#7"
    [107, 50*s], // "B7"
    // high C => 51s
    [108, 51*s], // "C8"
  ]);
  
  // will use centerXCoors
  const centerXCoors = new Map(Array.from(
    leftXCoors, 
    ([k, v]) => [k, v+hs]
));

  console.log("noteSpacing calculated!")

  return centerXCoors;
}

// returns map of pitch to boolean (true if white, false if black)
export const getKeyIsWhiteMap = () => {
  return new Map(Array.from(
    midiNumToName, 
    ([k, v]) => [k, v.length == 2 ? true : false]));
}

// returns array of vertical divider's x-coordinates for waterfall display
export const getWaterfallLines = (spacing: number) => {
  const s = spacing;
  return new Array(2*s, 5*s, 9*s, 12*s, 16*s, 19*s, 23*s, 26*s, 30*s, 33*s, 37*s, 40*s, 44*s, 47*s, 51*s);
}
export const a = new Array([]);

export const separateMidiEvents = (keyIsWhiteMap: Map<number, boolean>, midiEvents : SimplifiedMidi) => {
  let whiteMidiEvents : SimplifiedMidi = [];
  let blackMidiEvents : SimplifiedMidi = [];

  for (const event of midiEvents) {
    if (keyIsWhiteMap.get(event.pitch)){
      whiteMidiEvents.push(event);
    } else {
      blackMidiEvents.push(event);
    }
  }
  return [whiteMidiEvents, blackMidiEvents];
}

// determine change in notes [those to remove, those to add] based on prev vs cur notes
export const findActiveNotesDiff = (prevNotes : number[], curNotes : number[]) => {
  const intersection = prevNotes.filter(note => curNotes.includes(note));
  const notesToRemove = prevNotes.filter(note => !intersection.includes(note));
  const notesToAdd = curNotes.filter(note => !intersection.includes(note));

  return [notesToRemove, notesToAdd]
}
