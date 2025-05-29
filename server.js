const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const tokml = require('tokml');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

app.listen(5000, () => console.log('Server running on port 5000'));
