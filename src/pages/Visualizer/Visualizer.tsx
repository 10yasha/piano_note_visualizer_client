import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import MidiParser from "midi-parser-js";

import {
  processMidiData,
  fullSearchForIndex,
  quickSearchForIndex,
} from "../../etc/MidiProcessing";
import { RawMidi, SimplifiedMidi, NotesPressed } from "../../types/MidiTypes";
import "./Visualizer.css";

import MusicPlayer from "../../components/musicplayer/MusicPlayer";
import ActiveNotesDisplay from "../../components/activenotesdisplay/ActiveNotesDisplay";
import Waterfall from "../../components/waterfall/Waterfall";
import Keyboard from "../../components/keyboard/Keyboard";

function Visualizer() {
  // grab recordurl from last string in https://website/browse/faP8gKBuErg
  const params = useParams<{ recordurl: string }>();

  const [curTime, setCurTime] = useState<number>(0);

  const [midiData, setMidiData] = useState<SimplifiedMidi>([]);
  const [noteData, setNoteData] = useState<NotesPressed[]>([]);
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
        <div className="main">
          <div className="music-player-undocked">
            <MusicPlayer
              curTime={curTime}
              setCurTime={setCurTime}
              setAudioRecentlyToggled={setAudioRecentlyToggled}
              youtubeUrl={params.recordurl!}
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

export default Visualizer;
