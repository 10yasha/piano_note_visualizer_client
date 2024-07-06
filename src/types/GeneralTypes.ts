export type Player = "youtube" | "audio";

type tag = {id: number, recordingId: number, tag: string};

export interface RecordingInfo {
  id: string;
  url: string;
  name: string;
  enName: string; // English
  jpName: string; // Japanese (potentially kanji, empty if japanese not applicable)
  jpHiraganaName: string; // Japanese (in hiragana, empty if JPname already in hiragana)
  type: "vgm" | "op/ed" | "jazz" | "classical" | "free" | "original";
  mainTag: string;
  extraTags: tag[];
}

// for drawing
export type NoteDrawingSpecs = {
  whiteNoteWidth: number; // pixels
  blackNoteWidth: number; // pixels
  whiteNoteColor: string;
  blackNoteColor: string;
};