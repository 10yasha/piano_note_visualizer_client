import { useState, useRef, useEffect } from "react";
import MidiParser from "midi-parser-js";

import {
  processMidiData,
  fullSearchForIndex,
  quickSearchForIndex,
} from "./etc/MidiManipulation";
import { RawMidi, SimplifiedMidi, NotesInfo } from "./types/MidiTypes";
import "./App.css";

import Navbar from "./components/navbar/Navbar";
import MusicPlayer from "./components/musicplayer/MusicPlayer";
import ActiveNotesDisplay from "./components/activenotesdisplay/ActiveNotesDisplay";
import Waterfall from "./components/waterfall/Waterfall";
import Keyboard from "./components/keyboard/Keyboard";

function App() {
  const [curTime, setCurTime] = useState<number>(0);

  const [midiData, setMidiData] = useState<SimplifiedMidi>([]);
  const [noteData, setNoteData] = useState<NotesInfo>([]);
  const [curNotes, setCurNotes] = useState<number[]>([]); // by midi number
  const [audioRecentlyToggled, setAudioRecentlyToggled] =
    useState<boolean>(true);

  // index into midiData that current music playback is on.
  // -1 indicates has not hit first note
  const [curIndex, setCurIndex] = useState<number>(-1);

  const midiRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // console.debug("curTime:", curTime);
    if (noteData.length !== 0) {
      setCurrentNotes();
    }
  }, [curTime]);

  const getMidiData = () => {
    const midi = midiRef.current;
    if (midi) {
      MidiParser.parse(midi, (data: RawMidi) => {
        const [midiData, noteData] = processMidiData(data);

        setMidiData(midiData);
        setNoteData(noteData);
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

  return (
    <>
      <div className="app">
        <Navbar />
        <div className="body">
          <div className="music-player-freedom">
            <MusicPlayer
              curTime={curTime}
              setCurTime={setCurTime}
              setAudioRecentlyToggled={setAudioRecentlyToggled}
            />
          </div>
          <div>
            Load corresponding midi file{" "}
            <input type="file" ref={midiRef} onInput={getMidiData} />
          </div>
          <ActiveNotesDisplay curNotes={curNotes} />
          <Waterfall
            midiData={midiData}
            curTime={curTime}
            audioRecentlyToggled={audioRecentlyToggled}
          />
          <Keyboard newNotes={curNotes} />
        </div>
        <div className="footer"></div>
      </div>
    </>
  );
}

export default App;
