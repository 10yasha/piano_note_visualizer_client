export type Player = "youtube" | "audio";

export interface RecordInfo {
    id: string;
    ENname: string; // full name in English
    JPfname: string; // full name in Japanese (potentially kanji)
    JPhname: string; // hiragana name in Japanese
    type: "vgm" | "op/ed" | "jazz" | "classical" | "free" | "original";
    tags: string[];
  }