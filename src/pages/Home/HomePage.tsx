import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <header className="header">
        <div className="portraits">
          <div className="portrait">
            <img
              src="/src/worship/dmitri_shostakovich.jpg"
              alt="Dmitri Shostakovich"
            />
          </div>
          <div className="portrait">
            <img src="/src/worship/j_s_bach.jpg" alt="J S Bach" />
          </div>
          <div className="portrait">
            <img src="/src/worship/chick_corea.jpg" alt="Chick Corea" />
          </div>
          <div className="portrait">
            <img src="/src/worship/bill_evans.jpg" alt="Bill Evans" />
          </div>
        </div>
        <h1>Piano Visualizer</h1>
      </header>
    </div>
  );
}
