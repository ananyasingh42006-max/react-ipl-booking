
import { useState } from 'react';

function MatchCard({ match, onBook }) {
    const [customerName, setCustomerName] = useState('');
    const [tickets, setTickets] = useState(1);
    const [booking, setBooking] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setBooking(true);

        try {
            await onBook(match, customerName, Number(tickets));
            setCustomerName('');
            setTickets(1);
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="match-card">

            <div className="match-header">
                <span className="match-label">IPL MATCH</span>
                <span className="match-id">Match #{match.id}</span>
            </div>

            <div className="teams">
                <h3>{match.team1}</h3>
                <span className="vs">VS</span>
                <h3>{match.team2}</h3>
            </div>

            <div className="match-details">
                <p>
                    📅 <strong>Date:</strong> {match.match_date}
                </p>

                <p>
                    📍 <strong>Venue:</strong> {match.venue}
                </p>

                <p>
                    💰 <strong>Ticket Price:</strong> ₹{match.price}
                </p>

                <p>
                    🎟️ <strong>Available Seats:</strong>{' '}
                    {match.available_seats}
                </p>
            </div>

            {match.available_seats > 0 ? (
                <form onSubmit={handleSubmit} className="booking-form">

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        min="1"
                        max={match.available_seats}
                        value={tickets}
                        onChange={(e) => setTickets(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={booking}>
                        {booking ? 'Booking...' : 'Book Tickets'}
                    </button>

                </form>
            ) : (
                <p className="sold-out">SOLD OUT</p>
            )}

        </div>
    );
}

export default MatchCard;
