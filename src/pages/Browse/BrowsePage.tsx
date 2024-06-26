import { Link } from "react-router-dom";
import { dummyRecords } from "../../DummyRecords";

import "./BrowsePage.css";

export default function BrowsePage() {
  return (
    <div className="browse-page">
      <h1>Browse</h1>
      <div className="browse-list">
        {dummyRecords.map((record) => (
          <Link key={record.uuid} to={`/browse/${record.url}`}>
            {record.ENname}
          </Link>
        ))}
      </div>
    </div>
  );
}
