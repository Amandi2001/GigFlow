import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GigFeed from "./pages/GigFeed";
import CreateGig from "./pages/CreateGig";
import MyGigs from "./pages/MyGigs";
import MyBids from "./pages/MyBids";
import GigDetails from "./pages/GigDetails";

// Protected route component
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Freelancer routes */}
          <Route 
            path="/gigs" 
            element={
              <ProtectedRoute roles={["freelancer"]}>
                <GigFeed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bids" 
            element={
              <ProtectedRoute roles={["freelancer"]}>
                <MyBids />
              </ProtectedRoute>
            } 
          />

          {/* Client routes */}
          <Route 
            path="/create-gig" 
            element={
              <ProtectedRoute roles={["client"]}>
                <CreateGig />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-gigs" 
            element={
              <ProtectedRoute roles={["client"]}>
                <MyGigs />
              </ProtectedRoute>
            } 
          />

          {/* Shared route for gig details */}
          <Route 
            path="/gig/:id" 
            element={
              <ProtectedRoute>
                <GigDetails />
              </ProtectedRoute>
            } 
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
