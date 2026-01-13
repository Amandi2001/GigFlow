import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/mygigs.css";

const MyGigs = ({ user }) => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/gigs?ownerId=${user._id}`);
        setGigs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGigs();
  }, [user._id]);

  return (
    <div className="mygigs-container">
      <h2>My Gigs</h2>
      <div className="row">
        {gigs.length ? gigs.map((gig) => (
          <div key={gig._id} className="col-md-4 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{gig.title}</h5>
                <p className="card-text flex-grow-1">{gig.description}</p>
                <p className="card-text"><strong>Status:</strong> {gig.status}</p>
                <Link className="btn btn-info mt-auto" to={`/gig/${gig._id}`}>View Bids</Link>
              </div>
            </div>
          </div>
        )) : <p>No gigs created yet</p>}
      </div>
    </div>
  );
};

export default MyGigs;
