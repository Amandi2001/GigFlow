import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "freelancer" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData, { withCredentials: true });
      if (res.status === 201) {
        setUser(res.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" className="form-control mb-3" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="form-control mb-3" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />
          <select name="role" className="form-control mb-3" onChange={handleChange} value={formData.role}>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
          <button className="btn btn-success w-100">Register</button>
        </form>
        {error && <p className="text-danger mt-2">{error}</p>}
        <p className="mt-3 text-center">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
