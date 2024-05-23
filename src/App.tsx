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
import {
  processMidiData,
  getCurrentNotesFullSearch,
  getCurrentNotesQuickSearch,
} from "./etc/MidiManipulation";
import { midiNumToNameStr } from "./etc/Utilies";

function App() {
  const [percentage, setPercentage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [curTime, setCurTime] = useState<number>(0);

  const [midiData, setMidiData] = useState<ProcessedMidi>([]);
  const [noteData, setNoteData] = useState<NotesInfo>([]);
  const [curNotes, setCurNotes] = useState<string>("");
  const [audioRecentlyToggled, setAudioRecentlyToggled] =
    useState<boolean>(true);

  // index into midiData that current music playback is on.
  // -1 indicates has not hit first note
  const [curIndex, setCurIndex] = useState<number>(-1);

  const midiRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log("curNotes:", curNotes);
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
      setCurIndex(getCurrentNotesFullSearch(curTime, noteData));
      setAudioRecentlyToggled(false);
    } else {
      setCurIndex(getCurrentNotesQuickSearch(curTime, curIndex, noteData));
    }

    if (curIndex == -1) {
      setCurNotes("");
    } else {
      console.log("curIndex", curIndex);
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

    // situations where need to adjust midi data:
    if (time < curTime || Math.abs(time - curTime) > 1)
      setAudioRecentlyToggled(true);

    setPercentage(+percent);
    setCurTime(parseFloat(time.toFixed(2)));
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
          currentTime={curTime}
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
