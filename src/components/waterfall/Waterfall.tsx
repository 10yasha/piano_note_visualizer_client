import { useState, useEffect, useMemo } from "react";

import { getNoteSpacingMap } from "../../etc/KeyboardUtils";
import { updateWindow, normalizeMidiEvents } from "../../etc/MidiManipulation";
import { SimplifiedMidi } from "../../types/MidiTypes";
import { NoteDrawingSpecs } from "../../types/GeneralTypes";

import Canvas from "./canvas/Canvas";

interface WaterfallProps {
  curTime: number;
  midiData: SimplifiedMidi;
  audioRecentlyToggled: boolean;
}

function Waterfall({
  curTime,
  midiData,
  audioRecentlyToggled,
}: WaterfallProps) {
  const noteSpacing = useMemo(() => getNoteSpacingMap(22), []);
  const noteSpecs: NoteDrawingSpecs = {
    whiteNoteWidth: 16,
    blackNoteWidth: 10,
    whiteNoteColor: "#00abb4",
    blackNoteColor: "#00abb4",
  };

  // size of window in seconds containing relevant notes, from curTime-windSize to curTime+windafter
  const windSize = 5;

  // active notes window defined by index
  const [windStart, setWindStart] = useState<number>(0);
  const [windEnd, setWindEnd] = useState<number>(0);
  const [activeMidiData, setActiveMidiData] = useState<SimplifiedMidi>([]);

  useEffect(() => {
    let newWindStart: number, newWindEnd: number;
    if (audioRecentlyToggled) {
      // perform full search if audio was recently toggled/moved
      [newWindStart, newWindEnd] = updateWindow(
        curTime,
        midiData,
        0,
        0,
        windSize
      );
    } else {
      // only perform search to the right of current window indices, more efficient
      [newWindStart, newWindEnd] = updateWindow(
        curTime,
        midiData,
        windStart,
        windEnd,
        windSize
      );
    }

    setWindStart(newWindStart);
    setWindEnd(newWindEnd);

    setActiveMidiData([...midiData].slice(windStart, windEnd));
  }, [curTime, midiData, audioRecentlyToggled]);

  const draw = (
    context: CanvasRenderingContext2D,
    activeMidiData: SimplifiedMidi,
    windSize: number,
    noteSpacing: Map<number, number>,
    noteSpecs: NoteDrawingSpecs,
    curTime: number
  ) => {
    // background
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#0E2F44";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    const normalizedMidiEvents = normalizeMidiEvents(curTime, activeMidiData);

    for (const event of normalizedMidiEvents) {
      const xMidPoint = noteSpacing.get(event.pitch);
      if (xMidPoint !== undefined) {
        const yMin =
          ((windSize - event.offset) / windSize) * context.canvas.height;
        const noteHeight = Math.floor(
          ((event.offset - event.onset) / windSize) * context.canvas.height
        );

        context.fillStyle = noteSpecs.whiteNoteColor;
        context.fillRect(
          xMidPoint - noteSpecs.whiteNoteWidth / 2,
          yMin,
          noteSpecs.whiteNoteWidth,
          noteHeight
        );
      }
    }
  };

  return (
    <>
      <Canvas
        draw={draw}
        width={1144}
        height={300}
        curTime={curTime}
        activeMidiData={activeMidiData}
        windSize={windSize}
        noteSpacing={noteSpacing}
        noteSpecs={noteSpecs}
      />
    </>
  );
}

export default Waterfall;
