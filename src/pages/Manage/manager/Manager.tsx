import { Link } from "react-router-dom";
import { RecordingInfo } from "../../../types/GeneralTypes";
import "./Manager.css";

import { deleteRecording } from "../ManageApiHelper";
import { useEffect } from "react";

export default function Manager({
  records,
  fetchRecordings,
}: {
  records: RecordingInfo[];
  fetchRecordings: () => Promise<void>;
}) {
  const handleDelete = async (record: RecordingInfo) => {
    await deleteRecording(record);
    await fetchRecordings();
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  return (
    <div className="recording-manager">
      <div className="scroll-container">
        {records &&
          records.map((record) => (
            <div className="row" key={record.id}>
              <Link to={`/browse/${record.url}`}>{record.name}</Link>
              <div className="row-buttons">
                <button className="edit-button">Edit</button>
                <button
                  className="delete-button"
                  onClick={() => {
                    handleDelete(record);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
