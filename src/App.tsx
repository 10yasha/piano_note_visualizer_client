import { useState, useRef, useEffect } from "react";
import MidiParser from "midi-parser-js";

import {
  processMidiData,
  fullSearchForIndex,
  quickSearchForIndex,
} from "./etc/MidiManipulation";
import {
  RawMidi,
  ProcessedMidi,
  NotesInfo,
  NotesPressed,
} from "./types/MidiTypes";
import "./App.css";

import AudioPlayer from "./components/audioplayer/AudioPlayer";
import YoutubePlayer from "./components/youtubeplayer/YoutubePlayer";
import ActiveNotesDisplay from "./components/activenotesdisplay/ActiveNotesDisplay";
import Keyboard from "./components/keyboard/Keyboard";

function App() {
  const [curTime, setCurTime] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);
  const counterIncrement = 10; // milliseconds, rate at which current notes will update

  const [midiData, setMidiData] = useState<ProcessedMidi>([]);
  const [noteData, setNoteData] = useState<NotesInfo>([]);
  const [curNotes, setCurNotes] = useState<number[]>([]); // by midi number
  const [audioRecentlyToggled, setAudioRecentlyToggled] =
    useState<boolean>(true);

  // index into midiData that current music playback is on.
  // -1 indicates has not hit first note
  const [curIndex, setCurIndex] = useState<number>(-1);

  const midiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("cur time ", curTime);
    if (noteData.length !== 0) {
      setCurrentNotes();
    }
  }, [curTime]);

  const getMidiData = () => {
    const midi = midiRef.current;
    if (midi) {
      MidiParser.parse(midi, (data: RawMidi) => {
        const [convertedMidiData, convertedNoteData] = processMidiData(data);

        setMidiData(convertedMidiData);
        setNoteData(convertedNoteData);
      });
    }
  };

  const setCurrentNotes = () => {
    if (audioRecentlyToggled) {
      setCurIndex(fullSearchForIndex(curTime, noteData));
      setAudioRecentlyToggled(false);
    } else {
      setCurIndex(quickSearchForIndex(curTime, curIndex, noteData));
    }

    if (curIndex == -1) {
      setCurNotes([]);
    } else {
      setCurNotes(noteData[curIndex].notes);
    }
  };

  const syncCounter = (isPlaying: boolean) => {
    console.log("counter stopped");
    stopCounter();
    if (isPlaying) {
      console.log("counter restarted");
      startCounter();
    }
    setAudioRecentlyToggled(true);
  };

  /* following counter uses setInterval() to maintain a fast update rate so 
     active notes and waterfall feel responsive */
  const incrementTime = () =>
    setCurTime((curTime) => curTime + counterIncrement / 1000);

  const startCounter = () => {
    intervalRef.current = window.setInterval(incrementTime, counterIncrement);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <>
      <div className="app">
        <AudioPlayer
          curTime={curTime}
          setCurTime={setCurTime}
          syncCounter={syncCounter}
          stopCounter={stopCounter}
        />
        {/* <YoutubePlayer
          setCurTime={setCurTime}
          syncCounter={syncCounter}
          width={400}
          height={225}
        /> */}
        <div>
          Load a midi file{" "}
          <input type="file" ref={midiRef} onInput={getMidiData} />
        </div>
        <ActiveNotesDisplay curNotes={curNotes} />
      </div>
      <Keyboard activeNotes={curNotes} />
    </>
  );
}

export default App;
