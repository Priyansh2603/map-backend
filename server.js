const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tokml = require('tokml');
const dotenv = require('dotenv');
const userRoutes = require('./routes/authRoutes');
const fieldRoutes = require('./routes/field');
const { default: mongoose } = require('mongoose');
const fetch = require("node-fetch");
dotenv.config()
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/user',userRoutes);
app.use('/api/fields', fieldRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
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
console.log(process.env.MONGO_URI)
app.listen(5000, () => console.log('Server running on port 5000'));
