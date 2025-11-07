const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema & Model
const WeatherSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    condition: String,
    date: { type: Date, default: Date.now }
});
const Weather = mongoose.model('Weather', WeatherSchema);

// Routes
app.get('/api/weather', async (req, res) => {
    const data = await Weather.find();
    res.json(data);
});

app.post('/api/weather', async (req, res) => {
    const newWeather = new Weather(req.body);
    const saved = await newWeather.save();
    res.json(saved);
});

app.delete('/api/weather/:id', async (req, res) => {
    await Weather.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
});

// Catch-all for frontend
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
