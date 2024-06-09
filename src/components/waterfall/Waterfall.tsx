import { useState, useEffect, useMemo } from "react";

import {
  getNoteSpacingMap,
  getKeyIsWhiteMap,
  getWaterfallLines,
  separateMidiEvents,
} from "../../etc/KeyboardUtils";
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
  const noteSpacingMap = useMemo(() => getNoteSpacingMap(22), []);
  const waterfallDividers = useMemo(() => getWaterfallLines(22), []);
  const keyIsWhiteMap = useMemo(() => getKeyIsWhiteMap(), []);
  const noteSpecs: NoteDrawingSpecs = {
    whiteNoteWidth: 14,
    blackNoteWidth: 10,
    whiteNoteColor: "#03d9e5",
    blackNoteColor: "#00abb4",
  };

  // size of window in seconds containing relevant notes, for after and before curTime
  const windSize = 4;

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

  const drawNotes = (
    context: CanvasRenderingContext2D,
    midiEvents: SimplifiedMidi,
    windSize: number,
    noteSpacingMap: Map<number, number>,
    noteColor: string,
    noteWidth: number
  ) => {
    for (const event of midiEvents) {
      const xMidPoint = noteSpacingMap.get(event.pitch);
      if (xMidPoint !== undefined) {
        const yMin =
          ((windSize - event.release) / windSize) * context.canvas.height;
        const noteHeight = Math.floor(
          ((event.release - event.attack) / windSize) * context.canvas.height
        );

        // draw normal rectangles
        // context.fillStyle = noteColor;
        // context.fillRect(
        //   xMidPoint - noteWidth / 2,
        //   yMin,
        //   noteWidth,
        //   noteHeight
        // );

        // draw rounded rectangles
        context.fillStyle = noteColor;
        context.beginPath();
        context.roundRect(
          xMidPoint - noteWidth / 2,
          yMin,
          noteWidth,
          noteHeight,
          3
        );
        context.fill();
      }
    }
  };

  const draw = (
    context: CanvasRenderingContext2D,
    activeMidiData: SimplifiedMidi,
    postWindSize: number,
    noteSpacingMap: Map<number, number>,
    noteSpecs: NoteDrawingSpecs,
    keyIsWhiteMap: Map<number, boolean>,
    curTime: number
  ) => {
    // draw background
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#0E2F44";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    for (const dividerXCoor of waterfallDividers) {
      context.fillStyle = "#1b5c85";
      context.fillRect(dividerXCoor, 0, 1, context.canvas.height);
    }

    const normalizedMidiEvents = normalizeMidiEvents(curTime, activeMidiData);

    const [whiteMidiEvents, blackMidiEvents] = separateMidiEvents(
      keyIsWhiteMap,
      normalizedMidiEvents
    );

    // draw white notes first then black since white notes must be underneath
    drawNotes(
      context,
      whiteMidiEvents,
      postWindSize,
      noteSpacingMap,
      noteSpecs.whiteNoteColor,
      noteSpecs.whiteNoteWidth
    );

    drawNotes(
      context,
      blackMidiEvents,
      postWindSize,
      noteSpacingMap,
      noteSpecs.blackNoteColor,
      noteSpecs.blackNoteWidth
    );
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
        noteSpacingMap={noteSpacingMap}
        noteSpecs={noteSpecs}
        keyIsWhiteMap={keyIsWhiteMap}
      />
    </>
  );
}

export default Waterfall;
