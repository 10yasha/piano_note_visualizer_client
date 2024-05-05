import { useState, useRef, useEffect } from "react";
import starter_song from "./../example/FFXIII Sabers Edge.mp3";
import Slider from "./components/slider/Slider";
import ControlPanel from "./components/controls/ControlPanel";
import MidiParser from "midi-parser-js";
import {
  RawMidi,
  ProcessedMidi,
  NotesInfo,
  NotesPressed,
} from "./interfaces/Interfaces";
import { midiNumToNameStr } from "./etc/Utilies";

function App() {
  const [percentage, setPercentage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [midiData, setMidiData] = useState<ProcessedMidi>([]);
  const [noteData, setNoteData] = useState<NotesInfo>([]);
  const [curNotes, setCurNotes] = useState<string>("");
  const [audioRecentlyToggled, setAudioRecentlyToggled] =
    useState<boolean>(true);

  /* index into midiData that current music playback is on.
     useful to keep track of since this index will be nondecreasing
     thus searching for timestamp can be done by checking curIndex
     and what's slightly higher than current index */
  // -1 indicates has not hit first note
  const [curIndex, setCurIndex] = useState<number>(-1);

  const midiRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log(curNotes);
    if (noteData.length !== 0) {
      setCurrentNotes();
    }
  }, [currentTime]);

  const getMidiData = () => {
    const midi = midiRef.current;
    if (midi) {
      MidiParser.parse(midi, (data: RawMidi) => {
        processMidiData(data);
      });
    }
  };

  const processMidiData = (data: RawMidi) => {
    let rawMidiData = data.track.slice(-1)[0].event;
    /* last item is empty so pop it (ex.
      { "deltaTime": 1, "type": 255, "metaType": 47})*/
    rawMidiData.pop();

    const timeConversionFactor = data.timeDivision * 2;

    let currentTime = 0;
    let convertedMidiData: ProcessedMidi = [];
    let convertedNoteData: NotesInfo = [];
    let currentNotes: number[] = []; // store current notes being pressed

    rawMidiData.forEach((data) => {
      if (data.type == 9) {
        // note event
        currentTime += data.deltaTime / timeConversionFactor;

        // set converted midi data
        convertedMidiData.push({
          time: currentTime,
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
          time: currentTime,
          notes: [...currentNotes],
        });
      } else {
        // need to eliminate non-note events
        // should only be data.type == 11 (pedal event) arriving here
        // maybe need to double check?
        currentTime += data.deltaTime / timeConversionFactor;
      }
    });

    // console.log("after load", convertedNoteData[400].notes);
    setNoteData(convertedNoteData);
    setMidiData(convertedMidiData);
  };

  const timeMatches = (curTime: number, index: number) => {
    if (index == noteData.length) {
      return true;
    }

    if (curTime >= noteData[index].time && curTime < noteData[index + 1].time) {
      return true;
    } else {
      return false;
    }
  };

  // binary search
  const getCurrentNotesFullSearch = (curTime: number) => {
    let start = 0;
    let end = noteData.length - 1;

    while (start <= end) {
      let mid = Math.floor((start + end) / 2);

      if (timeMatches(curTime, mid)) {
        setCurIndex(mid);
        return;
      }

      if (curTime < noteData[mid].time) {
        end = mid - 1;
      } else {
        start = mid + 1;
      }
    }
    setCurIndex(-1);
  };

  const getCurrentNotesQuickSearch = (curTime: number) => {
    console.log("curTime ", curTime, " notetime ", noteData[curIndex + 1].time);
    /*while*/ if (
      // need smaller time step, currently too large
      curTime > noteData[curIndex + 1].time &&
      curIndex !== noteData.length
    ) {
      setCurIndex(curIndex + 1);
    }
  };

  const setCurrentNotes = () => {
    // if (audioRecentlyToggled) {
    //   getCurrentNotesFullSearch(currentTime);
    //   setAudioRecentlyToggled(false);
    // } else {
    //   getCurrentNotesQuickSearch(currentTime);
    // }
    getCurrentNotesFullSearch(currentTime);

    if (curIndex == -1) {
      setCurNotes("");
    } else {
      console.log("cur ind", curIndex);
      setCurNotes(
        noteData[curIndex].notes
          .map((noteNum: number) => {
            return midiNumToNameStr.get(noteNum);
          })
          .join(", ")
      );
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (audio.duration / 100) * e.target.valueAsNumber;
      setPercentage(e.target.valueAsNumber);
    }
  };

  const toggleAudioPlayback = () => {
    setAudioRecentlyToggled(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;

      if (!isPlaying) {
        setIsPlaying(true);
        audio.play();
      } else {
        setIsPlaying(false);
        audio.pause();
      }
    }
  };

  const getCurDuration = (e: React.ChangeEvent<HTMLAudioElement>) => {
    console.log("raw time ", e.currentTarget.currentTime);
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    setPercentage(+percent);
    setCurrentTime(parseFloat(time.toFixed(2)));
  };

  return (
    <>
      <div className="app-container">
        <h1>{starter_song}</h1>
        <Slider percentage={percentage} onChange={onChange} />
        <audio
          ref={audioRef}
          onTimeUpdate={getCurDuration}
          onLoadedData={(e) => {
            setDuration(parseFloat(e.currentTarget.duration.toFixed(2)));
          }}
          src={starter_song}
        ></audio>
        <ControlPanel
          toggleAudioPlayback={toggleAudioPlayback}
          isPlaying={isPlaying}
          duration={duration}
          currentTime={currentTime}
        />
        <div>
          Load a midi file{" "}
          <input type="file" ref={midiRef} onInput={getMidiData} />
        </div>
        {/* <div>{noteData.length !== 0 && <h3>{curNotes}</h3>}</div> */}
      </div>
      <div>{noteData.length !== 0 ? <h3>{curNotes}</h3> : <h3>hello</h3>}</div>
    </>
  );
}

export default App;
