const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tokml = require('tokml');
const dotenv = require('dotenv');
const userRoutes = require('./routes/authRoutes');
const { default: mongoose } = require('mongoose');
dotenv.config()
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/user',userRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
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
