import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import { RecordingInfo } from "../../types/GeneralTypes";
import api from "../../api/api";

import "./BrowsePage.css";

export default function BrowsePage() {
  const [records, setRecords] = useState<RecordingInfo[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await api.get("/recording");
        setRecords(res.data);
      } catch (e: unknown) {
        const err = e as AxiosError;
        if (err.response) {
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
        } else {
          console.error(`Error: ${err.message}`);
        }
      }
    };

    fetchRecordings();
  }, []);

  return (
    <div className="browse-page">
      <h1>Browse</h1>
      <div className="browse-list">
        {records &&
          records.map((record) => (
            <Link key={record.id} to={`/browse/${record.url}`}>
              {record.enName}
            </Link>
          ))}
      </div>
    </div>
  );
}
