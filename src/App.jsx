
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import MatchCard from './components/MatchCard';
import './App.css';

function App() {
    const [matches, setMatches] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Fetch IPL matches from Supabase
    const fetchMatches = async () => {
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .order('id');

        if (error) {
            console.error('Match fetching error:', error);
            setMessage('Unable to load matches. Please try again.');
            setMessageType('error');
        } else {
            setMatches(data);
        }

        setLoading(false);
    };

    // Fetch all booking details from Supabase
    const fetchBookings = async () => {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                id,
                customer_name,
                tickets,
                created_at,
                matches (
                    team1,
                    team2,
                    venue,
                    price
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Booking fetching error:', error);
            return;
        }

        setBookings(data);
    };

    // Handle ticket booking
    const handleBooking = async (match, customerName, tickets) => {

        setMessage('');

        if (!customerName.trim() ||
            !Number.isInteger(tickets) ||
            tickets < 1) {

            setMessage('Please enter valid booking details.');
            setMessageType('error');
            return;
        }

        if (tickets > match.available_seats) {
            setMessage('Sorry! Not enough seats available.');
            setMessageType('error');
            return;
        }

        setBookingLoading(true);

        try {

            // Step 1: Update available seats
            const { data: updatedMatch, error: updateError } =
                await supabase
                    .from('matches')
                    .update({
                        available_seats:
                            match.available_seats - tickets
                    })
                    .eq('id', match.id)
                    .eq('available_seats', match.available_seats)
                    .select();

            if (updateError ||
                !updatedMatch ||
                updatedMatch.length === 0) {

                setMessage(
                    'Seats have changed. Please refresh and try again.'
                );

                setMessageType('error');
                await fetchMatches();
                return;
            }

            // Step 2: Insert booking into database
            const { error: bookingError } = await supabase
                .from('bookings')
                .insert([
                    {
                        match_id: match.id,
                        customer_name: customerName.trim(),
                        tickets: tickets
                    }
                ]);

            if (bookingError) {

                console.error('Booking error:', bookingError);

                // Restore seats if booking insertion fails
                const { error: restoreError } = await supabase
                    .from('matches')
                    .update({
                        available_seats: match.available_seats
                    })
                    .eq('id', match.id)
                    .eq(
                        'available_seats',
                        match.available_seats - tickets
                    );

                if (restoreError) {
                    console.error('Seat restoration error:', restoreError);
                }

                setMessage('Booking failed. Please try again.');
                setMessageType('error');

                await fetchMatches();
                return;
            }

            // Step 3: Show success message
            setMessage(
                `Congratulations! ${tickets} ticket(s) booked successfully for ${match.team1} vs ${match.team2}.`
            );

            setMessageType('success');

            // Step 4: Refresh website data
            await fetchMatches();
            await fetchBookings();

        } catch (error) {

            console.error(error);

            setMessage('Something went wrong. Please try again.');
            setMessageType('error');

        } finally {
            setBookingLoading(false);
        }
    };

    // Load data and subscribe to realtime changes
    useEffect(() => {

        fetchMatches();
        fetchBookings();

        const channel = supabase
            .channel('ipl-live-updates')

            // Listen for match changes
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'matches'
                },
                () => {
                    fetchMatches();
                }
            )

            // Listen for booking changes
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookings'
                },
                () => {
                    fetchBookings();
                }
            )

            .subscribe((status) => {
                console.log('Realtime status:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };

    }, []);

    return (
        <div className="app">

            {/* NAVBAR */}
            <header className="navbar">

                <h2>🏏 IPL TICKET BOOKING</h2>

                <span>
                    Book Your Match Tickets
                </span>

            </header>


            {/* HERO SECTION */}
            <section className="hero">

                <h1>
                    Experience the IPL Live!
                </h1>

                <p>
                    Feel the excitement of cricket.
                    Book your favourite IPL match tickets today!
                </p>

                <a href="#matches" className="hero-btn">
                    Explore Matches
                </a>

            </section>


            {/* MATCH SECTION */}
            <main className="main-content" id="matches">

                <h2 className="section-title">
                    Upcoming IPL Matches
                </h2>

                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}

                {loading ? (

                    <p className="status">
                        Loading IPL matches...
                    </p>

                ) : matches.length === 0 ? (

                    <p className="status">
                        No matches available currently.
                    </p>

                ) : (

                    <div className="matches-grid">

                        {matches.map((match) => (

                            <MatchCard
                                key={match.id}
                                match={match}
                                onBook={handleBooking}
                                bookingLoading={bookingLoading}
                            />

                        ))}

                    </div>

                )}

            </main>


            {/* MY BOOKINGS SECTION */}
            <section className="bookings-section">

                <h2 className="section-title">
                    🎟️ My Bookings
                </h2>

                <p className="booking-count">
                    Total Bookings: {bookings.length}
                </p>

                {bookings.length === 0 ? (

                    <p className="status">
                        No bookings yet. Book your first IPL ticket!
                    </p>

                ) : (

                    <div className="booking-table-container">

                        <table className="booking-table">

                            <thead>

                                <tr>
                                    <th>Booking ID</th>
                                    <th>Customer Name</th>
                                    <th>Match</th>
                                    <th>Venue</th>
                                    <th>Tickets</th>
                                    <th>Booking Date</th>
                                </tr>

                            </thead>

                            <tbody>

                                {bookings.map((booking) => (

                                    <tr key={booking.id}>

                                        <td>
                                            #{booking.id}
                                        </td>

                                        <td>
                                            {booking.customer_name}
                                        </td>

                                        <td>
                                            {booking.matches
                                                ? `${booking.matches.team1} vs ${booking.matches.team2}`
                                                : 'Match unavailable'}
                                        </td>

                                        <td>
                                            {booking.matches?.venue || '-'}
                                        </td>

                                        <td>
                                            {booking.tickets}
                                        </td>

                                        <td>
                                            {booking.created_at
                                                ? new Date(
                                                    booking.created_at
                                                ).toLocaleDateString('en-IN')
                                                : '-'}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* FOOTER */}
            <footer className="footer">

                <p>
                    © 2026 IPL Ticket Booking
                    | Powered by React and Supabase
                </p>

            </footer>

        </div>
    );
}

export default App;
