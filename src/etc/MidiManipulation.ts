import {
  RawMidi,
  ProcessedMidi,
  SimplifiedMidi,
  NotesInfo,
} from "../types/MidiTypes";

const simplifyMidiData = (convertedMidiData : ProcessedMidi) : SimplifiedMidi => {
  let simplifiedMidiData : SimplifiedMidi = [];

  let ActiveEvents: SimplifiedMidi = []; // keep track of active events (ie. post-onset, pre-offset)

  convertedMidiData.forEach((newEvent) => {
    if (newEvent.press){
      // this is onset event, add new event to ActiveEvents
      ActiveEvents.push({onset: newEvent.time,
      offset: -1, // -1 => not filled in yet
      pitch: newEvent.pitch})
    } else { // offset
      // this is offset event, find the event in ActiveEvents that it corresponds to
      const index = ActiveEvents.findIndex((previousEvent) => {previousEvent.pitch == newEvent.pitch});

      // update offset time
      ActiveEvents[index].offset = newEvent.time;

      // move it from ActiveEvents to simplifiedMidiData
      simplifiedMidiData.push(ActiveEvents[index]);
      ActiveEvents.splice(index, 1);
    }
  });

  return simplifiedMidiData;
}

export const processMidiData = (data: RawMidi) : [SimplifiedMidi, NotesInfo] => {
  let rawMidiData = data.track.slice(-1)[0].event;
  /* last item is empty so pop it (ex.
    { "deltaTime": 1, "type": 255, "metaType": 47})*/
  // TODO Check this assumption???
  rawMidiData.pop();

  const timeConversionFactor = data.timeDivision * 2;

  let curTime = 0;
  let convertedMidiData: ProcessedMidi = [];
  let convertedNoteData: NotesInfo = [];
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


const timeMatches = (noteData: NotesInfo, curTime: number, index: number) => {
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
export const fullSearchForIndex = (curTime: number, noteData: NotesInfo) => {
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

// only search indices immediately above curIndex since time proceeds forwards xD
export const quickSearchForIndex = (curTime: number, curIndex: number, noteData: NotesInfo) => {
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
  window: number // window forwards and backwards
) => {
  const startTarget = curTime - window;
  const endTarget = curTime + window;

  while (windStart < midiData.length-1 && midiData[windStart].onset < startTarget) {
    windStart++;
  }

  while (windEnd < midiData.length-1 && midiData[windEnd].onset < endTarget) {
    windEnd++;
  }

  return [windStart, windEnd];
};

export const normalizeMidiEvents = (curTime: number, midiData: SimplifiedMidi) => {
  // TODO understand if forEach is is place after this is working, prob is but good to learn/check
  [...midiData].forEach((event) => {
    event.onset = event.onset - curTime; 
    event.offset = event.offset - curTime;
    return event;
  });

  return midiData;
}