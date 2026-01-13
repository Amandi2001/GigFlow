import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/gigdetails.css";

const GigDetails = ({ user }) => {
  const { id } = useParams();
  const [gig, setGig] = useState({});
  const [bids, setBids] = useState([]);
  const [bidData, setBidData] = useState({ message: "", price: "" });

  useEffect(() => {
    const fetchGig = async () => {
      const res = await axios.get(`http://localhost:5000/api/gigs/${id}`);
      setGig(res.data);
    };
    fetchGig();

    const fetchBids = async () => {
      const res = await axios.get(`http://localhost:5000/api/bids/${id}`);
      setBids(res.data);
    };
    fetchBids();
  }, [id]);

  const handleBidChange = (e) => setBidData({ ...bidData, [e.target.name]: e.target.value });

  const submitBid = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/bids`, { ...bidData, gigId: id, freelancerId: user._id });
      alert("Bid submitted successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const hireBid = async (bidId) => {
    try {
      await axios.patch(`http://localhost:5000/api/bids/${bidId}/hire`);
      alert("Freelancer hired!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="gigdetails-container">
      <div className="card shadow-sm p-4 mb-4">
        <h3>{gig.title}</h3>
        <p>{gig.description}</p>
        <p><strong>Budget:</strong> ${gig.budget}</p>
        <p><strong>Status:</strong> {gig.status}</p>
      </div>

      {user.role === "freelancer" && gig.status === "open" && (
        <div className="card shadow-sm p-4 mb-4">
          <h4>Submit Bid</h4>
          <form onSubmit={submitBid}>
            <input type="text" name="message" placeholder="Message" className="form-control mb-2" onChange={handleBidChange} required />
            <input type="number" name="price" placeholder="Price" className="form-control mb-2" onChange={handleBidChange} required />
            <button className="btn btn-success">Submit Bid</button>
          </form>
        </div>
      )}

      {user.role === "client" && bids.length > 0 && (
        <div className="card shadow-sm p-4">
          <h4>Bids</h4>
          {bids.map((bid) => (
            <div key={bid._id} className="bid-card mb-2 p-2 border rounded">
              <p><strong>Freelancer:</strong> {bid.freelancerName}</p>
              <p><strong>Message:</strong> {bid.message}</p>
              <p><strong>Price:</strong> ${bid.price}</p>
              <p><strong>Status:</strong> {bid.status}</p>
              {bid.status === "pending" && <button className="btn btn-primary" onClick={() => hireBid(bid._id)}>Hire</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GigDetails;
