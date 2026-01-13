import React, { useState } from "react";
import axios from "axios";
import "../styles/gigs.css";

const CreateGig = ({ user, navigate }) => {
  const [formData, setFormData] = useState({ title: "", description: "", budget: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/gigs", { ...formData, ownerId: user._id });
      if (res.status === 201) {
        navigate("/my-gigs");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gig");
    }
  };

  return (
    <div className="create-gig-container">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2 className="mb-4">Create New Gig</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" className="form-control mb-3" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" className="form-control mb-3" rows="4" onChange={handleChange} required />
          <input type="number" name="budget" placeholder="Budget ($)" className="form-control mb-3" onChange={handleChange} required />
          <button className="btn btn-success w-100">Create Gig</button>
        </form>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default CreateGig;
