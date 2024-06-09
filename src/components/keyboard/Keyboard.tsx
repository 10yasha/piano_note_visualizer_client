import { useState, useEffect } from "react";

import { midiNumToName, findActiveNotesDiff } from "../../etc/KeyboardUtils";
import "./Keyboard.css";

export default function Keyboard({ newNotes }: { newNotes: number[] }) {
  const [pressedNotes, setPressedNotes] = useState<number[]>([]);

  useEffect(() => {
    const [notesToRemove, notesToAdd] = findActiveNotesDiff(
      pressedNotes,
      newNotes
    );

    notesToRemove.forEach((midiId) => {
      document.getElementById(midiId.toString())?.classList.remove("active");
    });

    notesToAdd.forEach((midiId) => {
      document.getElementById(midiId.toString())?.classList.add("active");
    });

    setPressedNotes(newNotes);
  }, [newNotes]);

  return (
    <div className="keyboard">
      {Array.from(midiNumToName).map(([keyNum, noteName]) => {
        return (
          <div
            key={keyNum.toString()}
            id={keyNum.toString()}
            className={(noteName.length == 3 ? "black" : "white") + " key"}
          >
            <h4>
              {noteName.startsWith("C") && noteName.length == 2
                ? noteName.at(1)
                : ""}
            </h4>
          </div>
        );
      })}
    </div>
  );
}
