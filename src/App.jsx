
import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";

function App() {

  const [bookingCount, setBookingCount] = useState(0);

  const matches = [
    {
      id: 1,
      team1: "Royal Challengers Bengaluru",
      team2: "Chennai Super Kings",
      date: "20 April 2027",
      venue: "M. Chinnaswamy Stadium",
      price: 1500,
      seats: 100
    },

    {
      id: 2,
      team1: "Mumbai Indians",
      team2: "Kolkata Knight Riders",
      date: "22 April 2027",
      venue: "Wankhede Stadium",
      price: 1200,
      seats: 80
    },

    {
      id: 3,
      team1: "Sunrisers Hyderabad",
      team2: "Rajasthan Royals",
      date: "25 April 2027",
      venue: "Rajiv Gandhi Stadium",
      price: 1000,
      seats: 0
    }
  ];

  function handleBooking() {
    setBookingCount(bookingCount + 1);
  }

  return (
    <div>

      <Navbar bookingCount={bookingCount} />

      <Hero />

      <section className="matches-section" id="matches">

        <p className="section-tag">DON'T MISS THE ACTION</p>

        <h1>Upcoming Matches</h1>

        <p className="section-description">
          Choose your favourite team and book your tickets.
        </p>

        <div className="matches-container">

          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onBook={handleBooking}
            />
          ))}

        </div>

      </section>

      <footer id="booking">
        <p>© 2026 IPLZONE | Cricket. Passion. Excitement.</p>
      </footer>

    </div>
  );
}

export default App;
