
import { useState } from "react";

function MatchCard({ match, onBook }) {
  const [booked, setBooked] = useState(false);

  function handleBooking() {
    if (!booked && match.seats > 0) {
      setBooked(true);
      onBook();
    }
  }

  return (
    <div className="match-card">

      <div className="match-label">IPL MATCH</div>

      <h2>{match.team1}</h2>

      <p className="vs">VS</p>

      <h2>{match.team2}</h2>

      <div className="match-details">
        <p>📅 {match.date}</p>
        <p>📍 {match.venue}</p>
        <p>🎟️ ₹{match.price}</p>
        <p>Seats left: {match.seats}</p>
      </div>

      <button
        className={match.seats === 0 ? "sold-btn" : "book-btn"}
        onClick={handleBooking}
        disabled={match.seats === 0 || booked}
      >
        {match.seats === 0
          ? "Sold Out"
          : booked
          ? "Booked!"
          : "Book Ticket"}
      </button>

    </div>
  );
}

export default MatchCard;
