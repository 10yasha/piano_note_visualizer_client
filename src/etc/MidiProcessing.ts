import {
  RawMidi,
  ProcessedMidi,
  SimplifiedMidi,
  SimplifiedMidiEvent,
  NotesPressed
} from "../types/MidiTypes";

// simplify midi events to just the pitch and its attack and release times
const simplifyMidiData = (convertedMidiData : ProcessedMidi) : SimplifiedMidi => {
  let simplifiedMidiData : SimplifiedMidi = [];

  let ActiveEvents: SimplifiedMidi = []; // keep track of active events (ie. post-attack, pre-release)

  convertedMidiData.forEach((newEvent) => {
    if (newEvent.press){
      // this is attack event, add it to ActiveEvents
      ActiveEvents.push({attack: newEvent.time,
      release: -1, // tbd
      pitch: newEvent.pitch})
    } else {
      // this is release event, find the event in ActiveEvents that it corresponds to
      const index = ActiveEvents.findIndex((previousEvent) => previousEvent.pitch == newEvent.pitch);
      if (index === undefined || index < 0){
        console.error("Attempting to simplify midi did not match release event - index:", index, "event:", newEvent)
      }

      // update release time
      if (ActiveEvents[index].release == -1){
        ActiveEvents[index].release = newEvent.time;
      } else {
        console.error("Something is wrong with event index:", index, ActiveEvents[index])
      }

      // move it from ActiveEvents to simplifiedMidiData
      simplifiedMidiData.push(ActiveEvents[index]);
      ActiveEvents.splice(index, 1);
    }
  });

  return simplifiedMidiData.sort((eventA, eventB) => { return eventA.attack - eventB.attack });
}

// convert the raw midi to be usable
export const processMidiData = (data: RawMidi) : [SimplifiedMidi, NotesPressed[]] => {
  let rawMidiData = data.track.slice(-1)[0].event;
  /* last item is empty so pop it (ex.
    { "deltaTime": 1, "type": 255, "metaType": 47})*/
  // TODO Check this assumption???
  rawMidiData.pop();

  const timeConversionFactor = data.timeDivision * 2;

  let curTime = 0;
  let convertedMidiData: ProcessedMidi = [];
  let convertedNoteData: NotesPressed[] = [];
  let currentNotes: number[] = []; // store current notes being pressed

  rawMidiData.forEach((data) => {
    if (data.type == 9) {
      // note event
      curTime += data.deltaTime / timeConversionFactor;

      // set converted midi data
      convertedMidiData.push({
        time: curTime,
        pitch: data.data[0],
        press: data.data[1] == 0 ? false : true,
      });

      // set current notes data
      if (data.data[1] == 0) {
        // remove the note since velocity = 0 indicating release
        currentNotes.splice(currentNotes.indexOf(data.data[0]), 1);
      } else {
        currentNotes.push(data.data[0]);
      }

      convertedNoteData.push({
        time: curTime,
        notes: [...currentNotes.sort()],
      });
    } else {
      // need to eliminate non-note events
      // should only be data.type == 11 (pedal event) arriving here
      // maybe need to double check?
      curTime += data.deltaTime / timeConversionFactor;
    }
  });

  return [simplifyMidiData(convertedMidiData), convertedNoteData];
};

// given index into array of notesPressed, find if the curTime is between indexed event and immediate next event
const timeMatches = (noteData: NotesPressed[], curTime: number, index: number) => {
  if (index >= noteData.length-1) {
    return true;
  }

  if (curTime >= noteData[index].time && curTime < noteData[index + 1].time) {
    return true;
  } else {
    return false;
  }
};

// binary search through everything
export const fullSearchForIndex = (curTime: number, noteData: NotesPressed[]) => {
  let start = 0;
  let end = noteData.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (timeMatches(noteData, curTime, mid)) {
      return mid;
    }

    if (curTime < noteData[mid].time) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return -1;
};

// only search indices immediately above curIndex since time is nondecreasing duuhh
export const quickSearchForIndex = (curTime: number, curIndex: number, noteData: NotesPressed[]) => {
  let newIndex = curIndex;
  while (
    newIndex < noteData.length - 1 &&
    curTime > noteData[newIndex + 1].time
  ) {
    newIndex += 1;
  }

  return newIndex;
};

// for waterfall display
export const updateWindow = (
  curTime: number,
  midiData: SimplifiedMidi,
  windStart: number, // index in midiData
  windEnd: number, // index in midiData
  WindSize: number, // window to show upcoming notes, in seconds
) => {
  const endTarget = curTime + WindSize;

  while (windStart < midiData.length-1 && midiData[windStart].release < curTime) {
    windStart++;
  }

  while (windEnd < midiData.length-1 && midiData[windEnd].attack < endTarget) {
    windEnd++;
  }

  return [windStart, windEnd];
};

// subtract curTime from note attack and release times
export const normalizeMidiEvents = (curTime: number, midiData: SimplifiedMidi) => {
  let normalizedEvents : SimplifiedMidi = [];
  midiData.forEach((event) => {
    let normalizedEvent: SimplifiedMidiEvent = {
      attack: event.attack - curTime,
      release: event.release - curTime,
      pitch: event.pitch
    }
    normalizedEvents.push(normalizedEvent);
  });

  return normalizedEvents;
}