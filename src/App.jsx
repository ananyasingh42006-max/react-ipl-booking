
import React, { useState } from "react";
import "./App.css";

function App() {
  const [bookings, setBookings] = useState([]);

  const matches = [
    {
      id: 1,
      team1: "CSK",
      team2: "MI",
      date: "20 April 2026",
      venue: "Chennai"
    },
    {
      id: 2,
      team1: "RCB",
      team2: "KKR",
      date: "22 April 2026",
      venue: "Bengaluru"
    },
    {
      id: 3,
      team1: "SRH",
      team2: "RR",
      date: "24 April 2026",
      venue: "Hyderabad"
    }
  ];

  const toggleBooking = (match) => {
    if (bookings.some((booking) => booking.id === match.id)) {
      setBookings(bookings.filter((booking) => booking.id !== match.id));
    } else {
      setBookings([...bookings, match]);
    }
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <h2>IPL TICKET BOOKING</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#matches">Matches</a>
          <a href="#matches">Book Tickets</a>
          <a href="#bookings">My Bookings</a>
        </div>

        <div className="booking-count">
          Bookings: {bookings.length}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <h1>Experience the Stadium Energy Live!</h1>
        <p>
          Don't just watch the game. Be part of the action.
          Book your IPL tickets today!
        </p>

        <button
          className="explore-btn"
          onClick={() =>
            document.getElementById("matches").scrollIntoView({
              behavior: "smooth"
            })
          }
        >
          Explore Matches
        </button>
      </section>

      {/* Upcoming Matches */}
      <section className="matches-section" id="matches">
        <h2>Upcoming Matches</h2>

        <div className="match-container">
          {matches.map((match) => {
            const isBooked = bookings.some(
              (booking) => booking.id === match.id
            );

            return (
              <div className="match-card" key={match.id}>
                <h3>
                  {match.team1} vs {match.team2}
                </h3>

                <p>Date: {match.date}</p>
                <p>Venue: {match.venue}</p>

                <button
                  className="book-btn"
                  onClick={() => toggleBooking(match)}
                >
                  {isBooked ? "Cancel Booking" : "Book Tickets"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* My Bookings */}
      <section className="my-bookings" id="bookings">
        <h2>My Bookings</h2>

        <p className="total-bookings">
          Total Bookings: {bookings.length}
        </p>

        {bookings.length === 0 ? (
          <p>No tickets booked yet!</p>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div className="booking-item" key={booking.id}>
                <h3>
                  {booking.team1} vs {booking.team2}
                </h3>
                <p>Date: {booking.date}</p>
                <p>Venue: {booking.venue}</p>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default App;
