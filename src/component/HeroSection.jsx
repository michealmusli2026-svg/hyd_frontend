import React from "react";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center text-white px-6 max-w-md">
        <h1 className="text-5xl font-bold mb-6 text-blue-600">Welcome to MyApp</h1>
        
        <p className="text-xl mb-8 text-blue-600">
          Please login from the top right corner to access the dashboard.
        </p>
      </div>
    </div>
  );
}

export default HeroSection;