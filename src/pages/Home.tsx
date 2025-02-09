import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Globe } from 'lucide-react';

const Home = () => {
  const { guestLogin } = useAuth();

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
    } catch (error) {
      console.error('Guest login failed:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to EventHub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create, manage, and discover amazing events in your community
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <button
            onClick={handleGuestLogin}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            Try as Guest
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6">
          <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create Events</h3>
          <p className="text-gray-600">
            Easily create and manage your events with our intuitive tools
          </p>
        </div>
        <div className="text-center p-6">
          <Users className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect</h3>
          <p className="text-gray-600">
            Build your community and connect with attendees in real-time
          </p>
        </div>
        <div className="text-center p-6">
          <Globe className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Discover</h3>
          <p className="text-gray-600">
            Find exciting events happening in your area
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-8 my-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Events
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for featured events */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
              alt="Tech Conference"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Tech Conference 2025</h3>
              <p className="text-gray-600">Join us for the future of technology</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80"
              alt="Music Festival"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Summer Music Festival</h3>
              <p className="text-gray-600">Experience live music under the stars</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
              alt="Food Festival"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">Food & Wine Festival</h3>
              <p className="text-gray-600">Taste the world's finest cuisines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;