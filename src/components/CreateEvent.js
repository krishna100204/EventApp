import React, { useState } from 'react';

const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', { // Replace with your Cloudinary cloud name
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImage(data.secure_url); // Set the image URL from Cloudinary
    } catch (error) {
      console.error('Image upload error:', error);
      setError('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName,
          description,
          dateTime,
          location,
          category,
          image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setSuccess('Event created successfully!');
      // Reset form fields
      setEventName('');
      setDescription('');
      setDateTime('');
      setLocation('');
      setCategory('');
      setImage(null);
    } catch (error) {
      console.error('Event creation error:', error);
      setError('Event creation failed: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        placeholder="Event Name"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        required
      />
      {image && <img src={image} alt="Event" style={{ width: '100px', height: '100px' }} />}
      <button type="submit">Create Event</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default CreateEvent; 