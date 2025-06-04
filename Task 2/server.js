require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Schema & Model
const weatherSchema = new mongoose.Schema({
  location: String,
  date: String,
  temperature: String,
  description: String
});

const Weather = mongoose.model("Weather", weatherSchema);

// Create
app.post('/weather', async (req, res) => {
  try {
    const weatherData = new Weather(req.body);
    await weatherData.save();
    res.status(201).send("Weather data saved");
  } catch (err) {
    res.status(400).send("Error saving weather data");
  }
});

// Read
app.get('/weather', async (req, res) => {
  const data = await Weather.find({});
  res.json(data);
});

// Update
app.put('/weather/:id', async (req, res) => {
  try {
    await Weather.findByIdAndUpdate(req.params.id, req.body);
    res.send("Weather data updated");
  } catch (err) {
    res.status(400).send("Update failed");
  }
});

// Delete
app.delete('/weather/:id', async (req, res) => {
  try {
    await Weather.findByIdAndDelete(req.params.id);
    res.send("Weather data deleted");
  } catch (err) {
    res.status(400).send("Delete failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
