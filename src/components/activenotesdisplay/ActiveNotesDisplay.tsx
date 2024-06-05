import { midiNumToName } from "../../etc/KeyboardUtils";

import "./ActiveNotesDIsplay.css";

export default function ActiveNotesDisplay({
  curNotes,
}: {
  curNotes: number[];
}) {
  return (
    <div className="current-notes">
      {curNotes.length !== 0 ? (
        <h3>
          {curNotes
            .map((noteNum: number) => {
              return midiNumToName.get(noteNum);
            })
            .join(", ")}
        </h3>
      ) : (
        <h3></h3>
      )}
    </div>
  );
}
