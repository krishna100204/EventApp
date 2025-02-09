const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes'); // Adjust the path as necessary

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true });

// Use the event routes
app.use('/api/events', eventRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 