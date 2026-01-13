import React from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name}</h1>
      {user?.role === "client" ? (
        <div className="dashboard-buttons">
          <Link className="btn btn-primary" to="/create-gig">Create Gig</Link>
          <Link className="btn btn-info" to="/my-gigs">My Gigs</Link>
        </div>
      ) : (
        <div className="dashboard-buttons">
          <Link className="btn btn-primary" to="/gigs">Browse Gigs</Link>
          <Link className="btn btn-info" to="/my-bids">My Bids</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
