const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tokml = require('tokml');
const dotenv = require('dotenv');
const userRoutes = require('./routes/authRoutes');
const fieldRoutes = require('./routes/field');
const otpRoutes = require('./routes/Otp');
const { default: mongoose } = require('mongoose');
const { default: axios } = require('axios');
dotenv.config()
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/user', userRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/otp', otpRoutes);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();
app.use(express.json()); // parse JSON bodies

app.post("/proxy/ndmi", async (req, res) => {
  try {
    const response = await axios.post(
      "https://server.cropgenapp.com/get-vegetation-index",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Proxy failed" });
    }
  }
});
app.post("/proxy/weather", async (req, res) => {
  const { lat, lon } = req.body;

  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&hourly=relative_humidity_2m&timezone=auto`
    );
    const { current_weather, hourly, daily } = response.data;

    // Get the index of the current hour to match humidity
    const currentTime = current_weather.time;
    const currentHumidityIndex = hourly.time.indexOf(currentTime);
    const currentHumidity =
      hourly.relative_humidity_2m[currentHumidityIndex] || null;

    res.status(200).json({
      current: {
        ...current_weather,
        humidity: currentHumidity,
      },
      daily,
    });
  } catch (error) {
    console.error("Weather Proxy Error:", error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Weather proxy failed" });
    }
  }
});


app.post('/api/convert-to-kml', (req, res) => {
  const coordinates = req.body.coordinates;
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[...coordinates.map(coord => [coord.lng, coord.lat]), [coordinates[0].lng, coordinates[0].lat]]]
        }
      }
    ]
  };

  const kml = tokml(geojson);
  res.send({ kml });
});
console.log("check ", process.env.MONGO_URI)
app.listen(5000, () => console.log('Server running on port 5000'));
