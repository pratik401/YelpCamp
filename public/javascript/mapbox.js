  mapboxgl.accessToken = mapboxToken ;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  });
  const marker1 = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);