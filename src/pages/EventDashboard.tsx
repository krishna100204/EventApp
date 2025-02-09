import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageUrl?: string;
  attendees: string[];
}

const EventDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const { user } = useAuth();

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('attendeeUpdate', (data: { eventId: string; attendeeCount: number }) => {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === data.eventId
            ? { ...event, attendees: new Array(data.attendeeCount).fill('') }
            : event
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [category, dateRange]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (dateRange.start) params.append('startDate', dateRange.start);
      if (dateRange.end) params.append('endDate', dateRange.end);

      const response = await axios.get(`http://localhost:3000/api/events?${params}`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleAttend = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3000/api/events/${eventId}/attend`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchEvents();
    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  const categories = ['All', 'Conference', 'Workshop', 'Meetup', 'Concert', 'Exhibition'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All' ? '' : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-5 w-5 mr-2" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-5 w-5 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="h-5 w-5 mr-2" />
                    {event.attendees.length} attending
                  </div>
                </div>
                <button
                  onClick={() => handleAttend(event._id)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
                >
                  Attend Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventDashboard;