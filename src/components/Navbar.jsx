
function Navbar({ bookingCount }) {
  return (
    <nav className="navbar">
      <h2 className="logo">IPL<span>ZONE</span></h2>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#matches">Matches</a>
        <a href="#booking">Booking History</a>
      </div>

      <div className="booking-count">
        Bookings: {bookingCount}
      </div>
    </nav>
  );
}

export default Navbar;
