import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData, { withCredentials: true });
      // assume backend returns {name, email, role, _id}
      loginUser(res.data);
      navigate("/"); // redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ minWidth: "350px" }}>
        <h3 className="mb-3 text-center">Login</h3>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" className="form-control mb-2" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" className="form-control mb-3" onChange={handleChange} required />
          <button className="btn btn-primary w-100 mb-2">Login</button>
        </form>
        {error && <p className="text-danger">{error}</p>}
        <p className="text-center mt-2">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
