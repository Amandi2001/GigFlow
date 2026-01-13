import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/mybids.css";

const MyBids = ({ user }) => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bids/freelancer/${user._id}`);
        setBids(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBids();
  }, [user._id]);

  return (
    <div className="mybids-container">
      <h2>My Bids</h2>
      {bids.length ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Gig Title</th>
              <th>Message</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid._id}>
                <td>{bid.gigTitle}</td>
                <td>{bid.message}</td>
                <td>${bid.price}</td>
                <td>{bid.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No bids submitted yet</p>}
    </div>
  );
};

export default MyBids;
