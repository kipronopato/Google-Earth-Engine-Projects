// Geographical boundary of South Sudan.
var southSudanBounds = ee.FeatureCollection('projects/ee-37848633p/assets/ssd');

// Load Landsat 8 imagery.
var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
  .filterBounds(southSudanBounds)
  .filterDate('2020-01-01', '2020-12-31')
  .filterMetadata('CLOUD_COVER', 'less_than', 5)
  .median();

// Calculate Rock Index 
var RI = landsat.normalizedDifference(['SR_B7', 'SR_B2']); 
// Translate the RI for visualization.
var RIs = RI.add(100);
var clip = RIs.clip(southSudanBounds);

// Define a color palette for visualization.
var palette = ['red', 'yellow', 'blue']; 

// Visualize the Rock Index.
Map.addLayer(clip, {min: 100.14567360350493, max:100.6015037593985, palette: palette}, 'Rock Index');
Map.centerObject(southSudanBounds, 6);

// Export the image.
Export.image.toDrive({
  image: clip,
  description: 'Gold_ssd',
  scale: 30,
  region: southSudanBounds,
  fileFormat: 'GeoTIFF',
  crs: 'EPSG:4326'  // Optional: specify CRS if needed
});
