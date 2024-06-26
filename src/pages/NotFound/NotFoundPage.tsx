import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <h1>404 Not Found</h1>
      <Link to="/">Home</Link>
    </div>
  );
}
