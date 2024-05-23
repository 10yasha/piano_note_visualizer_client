import {
  RawMidi,
  ProcessedMidi,
  NotesInfo,
  NotesPressed,
} from "../interfaces/Interfaces";

export const processMidiData = (data: RawMidi) : [ProcessedMidi, NotesInfo] => {
  let rawMidiData = data.track.slice(-1)[0].event;
  /* last item is empty so pop it (ex.
    { "deltaTime": 1, "type": 255, "metaType": 47})*/
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

  return [convertedMidiData, convertedNoteData];
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

// only search indices immediately above curIndex
export const quickSearchForIndex = (curTime: number, curIndex: number, noteData: NotesInfo) => {
  let newIndex = curIndex;
  while (
    newIndex < noteData.length-1 &&
    curTime > noteData[newIndex + 1].time
  ) {
    newIndex += 1;
  }

  return newIndex;
};