import { useState, useEffect } from "react";

import { getNoteSpacingMap } from "../../etc/KeyboardUtils";
import { updateWindow, normalizeMidiEvents } from "../../etc/MidiManipulation";
import { SimplifiedMidi } from "../../types/MidiTypes";

import Canvas from "./canvas/Canvas";

interface WaterfallProps {
  curTime: number;
  midiData: SimplifiedMidi;
}

function Waterfall({ curTime, midiData }: WaterfallProps) {
  const noteSpacing = getNoteSpacingMap(22);
  const noteHalfWidth = 16; // for drawing, in pixels

  // size of window in seconds containing relevant notes, from curTime-windSize to curTime+windafter
  const windSize = 5;

  // active notes window defined by index
  const [windStart, setWindStart] = useState<number>(0);
  const [windEnd, setWindEnd] = useState<number>(0);
  const [activeMidiData, setActiveMidiData] = useState<SimplifiedMidi>([]);

  useEffect(() => {
    const [newWindStart, newWindEnd] = updateWindow(
      curTime,
      midiData,
      windStart,
      windEnd,
      windSize
    );
    setWindStart(newWindStart);
    setWindEnd(newWindEnd);

    setActiveMidiData([...midiData].slice(windStart, windEnd));
  }, [curTime, midiData]);

  const draw = (context: CanvasRenderingContext2D, count: number) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#0E2F44";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#00abb4";
    const d = count % 1144;
    context.fillRect(10 + d, 10, 100, 100);
  };

  const draw2 = (
    context: CanvasRenderingContext2D,
    activeMidiData: SimplifiedMidi,
    windSize: number,
    noteSpacing: Map<number, number>,
    noteHalfWidth: number,
    curTime: number
  ) => {
    // background
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#0E2F44";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // console.log("curtime and active:", curTime, activeMidiData);
    const normalizedMidiEvents = normalizeMidiEvents(curTime, activeMidiData);

    for (const event of normalizedMidiEvents) {
      const xMidPoint = noteSpacing.get(event.pitch);
      if (xMidPoint !== undefined) {
        const yMin =
          ((windSize - event.offset) / windSize) * context.canvas.height;
        const noteHeight = Math.floor(
          ((event.offset - event.onset) / windSize) * context.canvas.height
        );
        context.fillStyle = "#00abb4";

        context.fillRect(
          xMidPoint - noteHalfWidth / 2,
          yMin,
          noteHalfWidth,
          noteHeight
        );
      }
    }
  };

  return (
    <>
      <Canvas
        draw={draw}
        draw2={draw2}
        width={1144}
        height={300}
        curTime={curTime}
        activeMidiData={activeMidiData}
        windSize={windSize}
        noteSpacing={noteSpacing}
        noteHalfWidth={noteHalfWidth}
      />
    </>
  );
}

export default Waterfall;
