import { Link } from "react-router-dom";
import { useAllRecordings } from "../../hooks/useAllRecordings";

import "./BrowsePage.css";
import { useEffect } from "react";

export default function BrowsePage() {
  const { records, fetchRecordings } = useAllRecordings();

  useEffect(() => {
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
