import React, { useState } from "react";
import "./SearchBar.css";

import AlbumIcon from "@mui/icons-material/Album";
import CloseIcon from "@mui/icons-material/Close";

import { RecordingInfo } from "../../types/GeneralTypes";

interface SearchBarProps {
  placeholder: string;
  allRecords: RecordingInfo[];
  callback: (data: RecordingInfo) => void;
}

export default function SearchBar({
  placeholder,
  allRecords,
  callback,
}: SearchBarProps) {
  const [filteredRecords, setFilteredRecords] = useState<RecordingInfo[]>([]);
  const [searchEntered, setSearchEntered] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let search = e.target.value.toLowerCase();
    setSearchEntered(search);
    if (search === "") {
      setFilteredRecords([]);
      return;
    }

    let count = 0;
    let updatedRecords = allRecords.filter((val) => {
      let normalizedName = val.enName.toLowerCase();
      // early exit on count = 20, optimization to prevent slow search
      if (count < 20 && normalizedName.toLowerCase().includes(search)) {
        count++;
        return true;
      }
      return false;
    });

    setFilteredRecords(updatedRecords);
  };

  const clearInput = () => {
    setFilteredRecords([]);
    setSearchEntered("");
  };

  const handleClick = (data: RecordingInfo) => {
    callback(data);
    clearInput();
  };

  return (
    <div className="search">
      <div className="search-inputs">
        <input
          type="text"
          placeholder={placeholder}
          value={searchEntered}
          onChange={handleSearch}
        />

        {searchEntered.length === 0 ? (
          <div className="search-icon">
            <AlbumIcon />
          </div>
        ) : (
          <div className="close-icon">
            <CloseIcon id="clearBtn" onClick={clearInput} />
          </div>
        )}
      </div>
      {filteredRecords.length != 0 && (
        <div className="search-result">
          {filteredRecords.map((val) => {
            return (
              // TODO replace this with react link element later
              <a
                key={val.id}
                className="search-item"
                href={`/browse/${val.url}`}
                onClick={() => {
                  handleClick(val);
                }}
              >
                <p>{val.enName}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
