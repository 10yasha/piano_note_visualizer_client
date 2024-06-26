export type Player = "youtube" | "audio";

export interface RecordInfo {
  uuid: string;
  uri: string;
  name: string;
  ENname: string; // English
  JPname: string; // Japanese (potentially kanji)
  JPhiragananame: string; // Japanese (in hiragana, empty if JPname fine as is)
  type: "vgm" | "op/ed" | "jazz" | "classical" | "free" | "original";
  tag: string;
  addtags: string[];
}

// for drawing
export type NoteDrawingSpecs = {
  whiteNoteWidth: number; // pixels
  blackNoteWidth: number; // pixels
  whiteNoteColor: string;
  blackNoteColor: string;
};